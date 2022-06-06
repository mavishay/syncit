import { Controller, Get, Req, Res } from "@nestjs/common";

import { CalendarsService } from "./calendars.service";

@Controller("calendars")
export class CalendarsController {
  constructor(private readonly calendarsService: CalendarsService) {
  }

  @Get("availableCalendars")
  async me(@Req() request: Request, @Res() response: Response) {
    return this.calendarsService.availableCalendars(request, response);
  }
}
