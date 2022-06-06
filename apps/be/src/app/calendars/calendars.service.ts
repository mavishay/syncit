import { Injectable } from "@nestjs/common";
import { GoogleCalendarService } from "../../../../../libs/integrations/src/google-calendar";
import { getUserDataFromSessionId } from "@syncit/core/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

@Injectable()
export class CalendarsService {
  async availableCalendars(req, res) {
    const userData = await getUserDataFromSessionId(req.cookies.sessionID);
    const credentials = await prisma.credential.findMany({
      where: {
        userId: userData.id
      }
    });
    console.warn(credentials);
    const output = [];
    const promises = [];
    credentials.forEach((cred) => {
      output.push({ id: cred.id, name: cred.account, type: cred.type });
      const googleCalendarService = new GoogleCalendarService(cred);
      promises.push(googleCalendarService.listCalendars());
    });
    const list = await Promise.all(promises);
    list.forEach((_, ind) => {
      output[ind].calendars = list[ind];
    });
    res.status(200).json({ list: output });
  }
}
