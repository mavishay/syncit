import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { CalendarsController } from "./calendars/calendars.controller";
import { CalendarsService } from "./calendars/calendars.service";
import { IntegrationsController } from "./integrations/integrations.controller";
import { UserDataMiddleware } from "./user.data.middleware";

@Module({
  imports: [],
  controllers: [AuthController, CalendarsController, IntegrationsController],
  providers: [AuthService, CalendarsService]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserDataMiddleware).forRoutes('*');
  }
}
