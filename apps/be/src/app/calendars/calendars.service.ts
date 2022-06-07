import { Injectable } from "@nestjs/common";
import { GoogleCalendarService } from "../../../../../libs/integrations/src/google-calendar";
import { getUserDataFromSessionId } from "@syncit/core/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class CalendarsService {
  async addSelectedCalendar(req, res) {
    const { userData } = res.locals;

    await prisma.selectedCalendar.create({
      data: {
        userId: parseFloat(userData.id),
        integration: req.body.integration,
        externalId: req.body.externalId
      }
    });
    res.send("ok");
  }

  async deleteSelectedCalendar(req, res) {
    const { userData } = res.locals;

    await prisma.selectedCalendar.deleteMany({
      where: {
        userId: parseFloat(userData.id),
        integration: req.body.integration,
        externalId: req.body.externalId
      }
    });
    res.send("ok");
  }

  async availableCalendars(req, res) {
    const { userData } = res.locals;
    const credentials = await prisma.credential.findMany({
      where: {
        userId: userData.id
      }
    });
    const output = [];
    const promises = [];
    credentials.forEach((cred) => {
      output.push({ id: cred.id, name: cred.account, type: cred.type });
      const googleCalendarService = new GoogleCalendarService(cred);
      promises.push(googleCalendarService.listCalendars());
    });
    const list = await Promise.all(promises);
    const selectedCalendars = await prisma.selectedCalendar.findMany({
      where: {
        userId: userData.id
      }
    });
    const selectedCalendarsIds = selectedCalendars.map(cal => cal.externalId);

    list.forEach((accountCalendars, ind) => {
      const mappedList = accountCalendars.map((cal) => ({
        ...cal, enabled: selectedCalendarsIds.includes(cal.externalId)
      }));

      output[ind].calendars = mappedList;
    });
    res.status(200).json({ list: output });
  }
}
