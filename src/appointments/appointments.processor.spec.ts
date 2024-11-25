import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Job, MinimalQueue } from "bullmq";
import { AppointmentsProcessor } from "./appointments.processor";
import { MetricsService } from "../metrics/metrics.service";
import { Appointment } from "./schemas/appointment.schema";

describe("AppointmentsProcessor", () => {
  let processor: AppointmentsProcessor;
  let appointmentModel: any;
  let metricsService: any;

  beforeEach(async () => {
    appointmentModel = {
      create: jest.fn(),
    };
    metricsService = {
      recordJobMetric: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsProcessor,
        {
          provide: getModelToken(Appointment.name),
          useValue: appointmentModel,
        },
        { provide: MetricsService, useValue: metricsService },
      ],
    }).compile();

    processor = module.get<AppointmentsProcessor>(AppointmentsProcessor);
  });

  it("should process CSV content and create appointments", async () => {
    const csvContent = `id,patient_id,doctor,appointment_date,reason
1,101,Dr. Smith,2023-10-01T10:00:00Z,Checkup
2,102,Dr. Jones,2023-10-02T11:00:00Z,Consultation`;

    const jobMock = {
      updateProgress: jest.fn(),
    };
    const result = await processor.processCsv(
      csvContent,
      jobMock as unknown as Job
    );

    expect(appointmentModel.create).toHaveBeenCalledTimes(2);
    expect(appointmentModel.create).toHaveBeenCalledWith({
      id: 1,
      patient_id: 101,
      doctor: "Dr. Smith",
      appointment_date: new Date("2023-10-01T10:00:00Z"),
      reason: "Checkup",
    });
    expect(appointmentModel.create).toHaveBeenCalledWith({
      id: 2,
      patient_id: 102,
      doctor: "Dr. Jones",
      appointment_date: new Date("2023-10-02T11:00:00Z"),
      reason: "Consultation",
    });
    expect(metricsService.recordJobMetric).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ processed: 2 });
  });
});
