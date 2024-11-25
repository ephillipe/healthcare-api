import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { getQueueToken } from "@nestjs/bullmq";
import { AppointmentsService } from "./appointments.service";
import { Appointment } from "./schemas/appointment.schema";
import { MetricsService } from "../metrics/metrics.service";
import { NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { Queue } from "bullmq";

describe("AppointmentsService", () => {
  let service: AppointmentsService;
  let model: Model<Appointment>;
  let queue: Queue;
  let metricsService: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getModelToken(Appointment.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getQueueToken("appointments"),
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: MetricsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    model = module.get<Model<Appointment>>(getModelToken(Appointment.name));
    queue = module.get<Queue>(getQueueToken("appointments"));
    metricsService = module.get<MetricsService>(MetricsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of appointments", async () => {
      const result = [{ id: 1, patient_id: 1, doctor: "Dr. Smith" }];
      jest.spyOn(model, "find").mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      } as any);
      expect(await service.findAll()).toEqual(result);
    });
  });

  describe("findOne", () => {
    it("should return a single appointment", async () => {
      const result = { id: 1, patient_id: 1, doctor: "Dr. Smith" };
      jest.spyOn(model, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValue(result),
      } as any);
      expect(await service.findOne(1)).toEqual(result);
    });

    it("should throw a NotFoundException if appointment not found", async () => {
      jest.spyOn(model, "findOne").mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe("processAppointmentsCsv", () => {
    it("should add a job to the queue and return the job ID", async () => {
      const jobId = { id: "123" };
      jest.spyOn(queue, "add").mockResolvedValue(Promise.resolve(jobId as any));
      expect(await service.processAppointmentsCsv("csvContent")).toEqual("123");
    });
  });
});
