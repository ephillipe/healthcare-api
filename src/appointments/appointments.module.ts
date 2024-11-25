import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BullModule } from "@nestjs/bull";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { AppointmentsProcessor } from "./appointments.processor";
import { Appointment, AppointmentSchema } from "./schemas/appointment.schema";
import { MetricsModule } from "../metrics/metrics.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    BullModule.registerQueue({
      name: "appointments",
    }),
    MetricsModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsProcessor],
})
export class AppointmentsModule {}
