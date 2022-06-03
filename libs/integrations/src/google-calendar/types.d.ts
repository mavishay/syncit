export interface Calendar {
  createEvent(event: CalendarEvent): Promise<NewCalendarEventType>;

  updateEvent(
    uid: string,
    event: CalendarEvent,
    externalCalendarId?: string | null
  ): Promise<Event | Event[]>;

  deleteEvent(uid: string, event: CalendarEvent, externalCalendarId?: string | null): Promise<unknown>;

  getAvailability(
    dateFrom: string,
    dateTo: string,
    selectedCalendars: IntegrationCalendar[]
  ): Promise<EventBusyDate[]>;

  listCalendars(event?: CalendarEvent): Promise<IntegrationCalendar[]>;
}
export interface CalendarEvent {
  type: string;
  title: string;
  startTime: string;
  endTime: string;
  organizer: Person;
  attendees: Person[];
  additionalNotes?: string | null;
  customInputs?: Prisma.JsonObject | null;
  description?: string | null;
  team?: {
    name: string;
    members: string[];
  };
  location?: string | null;
  conferenceData?: ConferenceData;
  additionInformation?: AdditionInformation;
  uid?: string | null;
  videoCallData?: VideoCallData;
  paymentInfo?: PaymentInfo | null;
  destinationCalendar?: DestinationCalendar | null;
  cancellationReason?: string | null;
  rejectionReason?: string | null;
  hideCalendarNotes?: boolean;
  recurrence?: string;
}
export type EventBusyDate = Record<"start" | "end", Date | string>;
export interface IntegrationCalendar extends Ensure<Partial<SelectedCalendar>, "externalId"> {
  primary?: boolean;
  name?: string;
}
export type NewCalendarEventType = {
  uid: string;
  id: string;
  type: string;
  password: string;
  url: string;
  additionalInfo: Record<string, any>;
};
export interface GoogleCalError extends Error {
  code?: number;
}
export type Person = {
  name?: string;
  email?: string;
  dir?: string;
  timeZone?: string;
};
