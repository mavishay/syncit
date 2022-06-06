import { GoogleCalendarService } from "../../../../../libs/integrations/src/google-calendar";

export default async function handler(req, res) {
  const output = [];
  const promises = [];
  const { credentials } = req.body;
  console.warn(credentials);
  credentials.forEach((cred) => {
    output.push({ id: cred.id, name: cred.account, type: cred.type });
    const googleCalendarService = new GoogleCalendarService(cred);
    promises.push(googleCalendarService.listCalendars());
  });
  const list = await Promise.all(promises);
  list.forEach((_,ind) => {
    output[ind].calendars = list[ind]
  })
  res.status(200).json({ list: output });
}
