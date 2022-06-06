import { Module } from "@nestjs/common";

import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { CalendarsController } from "./calendars/calendars.controller";
import { CalendarsService } from "./calendars/calendars.service";
import { IntegrationsController } from "./integrations/integrations.controller";

@Module({
  imports: [],
  controllers: [AuthController, CalendarsController, IntegrationsController],
  providers: [AuthService, CalendarsService]
})

export class AppModule {
}
