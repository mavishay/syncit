/* eslint-disable @typescript-eslint/naming-convention,import/no-extraneous-dependencies,@typescript-eslint/no-shadow,no-async-promise-executor,import/prefer-default-export */
import { Credential, Prisma, PrismaClient } from "@prisma/client";
import { GetTokenResponse } from "google-auth-library/build/src/auth/oauth2client";
import { Auth, calendar_v3, google } from "googleapis";
import { getLocation, getRichDescription, HttpError, MyGoogleAuth } from "@syncit/core/utils";
import type { CalendarEvent, EventBusyDate, GoogleCalError, IntegrationCalendar, NewCalendarEventType } from "./types";

const prisma = new PrismaClient();

export class GoogleCalendarService {
  private url = "";

  private integrationName = "";

  private auth: Promise<{ getToken: () => Promise<MyGoogleAuth> }>;

  private client_id = "";

  private client_secret = "";

  private redirect_uri = "";

  constructor(credential: Credential) {
    this.integrationName = "google_calendar";
    this.auth = this.googleAuth(credential).then((m) => m);
  }

  async createEvent(calEventRaw: CalendarEvent): Promise<NewCalendarEventType> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();
      const payload: calendar_v3.Schema$Event = {
        summary: calEventRaw.title,
        description: getRichDescription(calEventRaw),
        start: {
          dateTime: calEventRaw.startTime,
          timeZone: calEventRaw.organizer.timeZone
        },
        end: {
          dateTime: calEventRaw.endTime,
          timeZone: calEventRaw.organizer.timeZone
        },
        attendees: [
          { ...calEventRaw.organizer, organizer: true },
          ...calEventRaw.attendees.map((attendee) => ({
            ...attendee,
            responseStatus: "accepted"
          }))
        ],
        reminders: {
          useDefault: true
        }
      };

      if (calEventRaw.location) {
        payload.location = getLocation(calEventRaw);
      }

      if (calEventRaw.conferenceData && calEventRaw.location === "integrations:google:meet") {
        payload.conferenceData = calEventRaw.conferenceData;
      }
      const calendar = google.calendar({
        version: "v3"
      });
      calendar.events.insert(
        {
          auth: myGoogleAuth,
          calendarId: calEventRaw.destinationCalendar?.externalId
            ? calEventRaw.destinationCalendar.externalId
            : "primary",
          requestBody: payload,
          conferenceDataVersion: 1
        },
        (err, event) => {
          if (err || !event?.data) {
            console.error("There was an error contacting google calendar service: ", err);
            return reject(err);
          }

          calendar.events.patch({
            // Update the same event but this time we know the hangout link
            calendarId: calEventRaw.destinationCalendar?.externalId
              ? calEventRaw.destinationCalendar.externalId
              : "primary",
            auth: myGoogleAuth,
            eventId: event.data.id || "",
            requestBody: {
              description: getRichDescription({
                ...calEventRaw,
                additionInformation: { hangoutLink: event.data.hangoutLink || "" }
              })
            }
          });

          return resolve({
            uid: "",
            ...event.data,
            id: event.data.id || "",
            additionalInfo: {
              hangoutLink: event.data.hangoutLink || ""
            },
            type: "google_calendar",
            password: "",
            url: ""
          });
        }
      );
    });
  }

  async updateEvent(uid: string, event: CalendarEvent, externalCalendarId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();
      const payload: calendar_v3.Schema$Event = {
        summary: event.title,
        description: getRichDescription(event),
        start: {
          dateTime: event.startTime,
          timeZone: event.organizer.timeZone
        },
        end: {
          dateTime: event.endTime,
          timeZone: event.organizer.timeZone
        },
        attendees: event.attendees,
        reminders: {
          useDefault: true
        }
      };

      if (event.location) {
        payload.location = getLocation(event);
      }

      const calendar = google.calendar({
        version: "v3",
        auth: myGoogleAuth
      });
      calendar.events.update(
        {
          auth: myGoogleAuth,
          calendarId: externalCalendarId || event.destinationCalendar?.externalId,
          eventId: uid,
          sendNotifications: true,
          sendUpdates: "all",
          requestBody: payload
        },
        (err, event: any) => {
          if (err) {
            console.error("There was an error contacting google calendar service: ", err);

            return reject(err);
          }
          return resolve(event?.data);
        }
      );
    });
  }

  async deleteEvent(uid: string, event: CalendarEvent, externalCalendarId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();
      const calendar = google.calendar({
        version: "v3",
        auth: myGoogleAuth
      });
      calendar.events.delete(
        {
          auth: myGoogleAuth,
          calendarId: externalCalendarId || event.destinationCalendar?.externalId,
          eventId: uid,
          sendNotifications: true,
          sendUpdates: "all"
        },
        (err: GoogleCalError | null, event) => {
          if (err) {
            /* 410 is when an event is already deleted on the Google cal before on cal.com
            404 is when the event is on a different calendar */
            console.error("There was an error contacting google calendar service: ", err);
            if (err.code === 410 || err.code === 404) return resolve();
            return reject(err);
          }
          return resolve(event?.data);
        }
      );
    });
  }

  async getAvailability(
    dateFrom: string,
    dateTo: string,
    selectedCalendars: IntegrationCalendar[]
  ): Promise<EventBusyDate[]> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();
      const calendar = google.calendar({
        version: "v3",
        auth: myGoogleAuth
      });
      const selectedCalendarIds = selectedCalendars
        .filter((e: any) => e.integration === this.integrationName)
        .map((e: any) => e.externalId);
      if (selectedCalendarIds.length === 0 && selectedCalendars.length > 0) {
        // Only calendars of other integrations selected
        resolve([]);
        return;
      }

      (selectedCalendarIds.length === 0
          ? calendar.calendarList
            .list()
            .then((cals) => cals.data.items?.map((cal) => cal.id).filter(Boolean) || [])
          : Promise.resolve(selectedCalendarIds)
      )
        .then((calsIds) => {
          calendar.freebusy.query(
            {
              requestBody: {
                timeMin: dateFrom,
                timeMax: dateTo,
                items: calsIds.map((id) => ({ id }))
              }
            },
            (err, apires) => {
              if (err) {
                reject(err);
              }
              let result: any = [];

              if (apires?.data.calendars) {
                result = Object.values(apires.data.calendars).reduce((c: any, i: any) => {
                  i.busy?.forEach((busyTime) => {
                    c.push({
                      start: busyTime.start || "",
                      end: busyTime.end || ""
                    });
                  });
                  return c;
                }, [] as typeof result);
              }
              resolve(result);
            }
          );
        })
        .catch((err) => {
          console.error("There was an error contacting google calendar service: ", err);
          reject(err);
        });
    });
  }

  async listCalendars(): Promise<IntegrationCalendar[]> {
    return new Promise(async (resolve, reject) => {
      const auth = await this.auth;
      const myGoogleAuth = await auth.getToken();
      const calendar = google.calendar({
        version: "v3",
        auth: myGoogleAuth
      });

      calendar.calendarList
        .list()
        .then((cals) => {
          resolve(
            cals.data.items?.map((cal) => {
              const calendar: any = {
                externalId: cal.id ?? "No id",
                integration: this.integrationName,
                name: cal.summary ?? "No name",
                primary: cal.primary ?? false
              };
              return calendar;
            }) || []
          );
        })
        .catch((err: Error) => {
          console.error("There was an error contacting google calendar service: ", err);
          reject(err);
        });
    });
  }

  private googleAuth = async ({ id, key }: Credential) => {
    const { client_id, client_secret, redirect_uris } = JSON.parse(process.env.GOOGLE_API_CREDENTIALS).web;
    if (typeof client_id === "string") this.client_id = client_id;
    if (typeof client_secret === "string") this.client_secret = client_secret;
    if (typeof redirect_uris === "object" && Array.isArray(redirect_uris)) {
      this.redirect_uri = redirect_uris[0] as string;
    }
    if (!this.client_id) throw new HttpError({ statusCode: 400, message: "Google client_id missing." });
    if (!this.client_secret)
      throw new HttpError({ statusCode: 400, message: "Google client_secret missing." });
    if (!this.redirect_uri) throw new HttpError({ statusCode: 400, message: "Google redirect_uri missing." });

    const myGoogleAuth = new MyGoogleAuth(this.client_id, this.client_secret, this.redirect_uri);

    const googleCredentials = key as Auth.Credentials;
    myGoogleAuth.setCredentials(googleCredentials);

    const isExpired = () => myGoogleAuth.isTokenExpiring();

    const refreshAccessToken = () =>
      myGoogleAuth
        .refreshToken(googleCredentials.refresh_token)
        .then(async (res: GetTokenResponse) => {
          const token = res.res?.data;
          googleCredentials.access_token = token.access_token;
          googleCredentials.expiry_date = token.expiry_date;
          await prisma.credential.update({
            where: {
              id
            },
            data: {
              key: googleCredentials as Prisma.InputJsonValue
            }
          });
          myGoogleAuth.setCredentials(googleCredentials);
          return myGoogleAuth;
        })
        .catch((err) => {
          console.error("Error refreshing google token", err);
          return myGoogleAuth;
        });

    return {
      getToken: () => (!isExpired() ? Promise.resolve(myGoogleAuth) : refreshAccessToken())
    };
  };
}
