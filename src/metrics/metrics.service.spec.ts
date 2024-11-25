import { Test, TestingModule } from "@nestjs/testing";
import { MetricsService } from "./metrics.service";
import { ConfigService } from "@nestjs/config";
import { InfluxDB, WriteApi, Point } from "@influxdata/influxdb-client";

jest.mock("@influxdata/influxdb-client", () => {
  const actual = jest.requireActual("@influxdata/influxdb-client");
  return {
    ...actual,
    InfluxDB: jest.fn().mockImplementation(() => ({
      getWriteApi: jest.fn().mockReturnValue({
        writePoint: jest.fn(),
        close: jest.fn(),
      }),
    })),
  };
});

describe("MetricsService", () => {
  let service: MetricsService;
  let writeApiMock: jest.Mocked<WriteApi>;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case "INFLUXDB_URL":
          return "http://mock-influxdb-url:8086";
        case "INFLUXDB_TOKEN":
          return "your-token";
        case "INFLUXDB_ORG":
          return "healthcare";
        case "INFLUXDB_BUCKET":
          return "metrics";
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetricsService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("recordApiMetric", () => {
    it("should record API metrics", async () => {
      const data = {
        method: "GET",
        path: "/test",
        statusCode: 200,
        duration: 100,
      };
      const record = jest.spyOn(service as any, "record");
      await service.recordApiMetric(data);
      expect(record).toHaveBeenCalled();
    });
  });

  describe("recordJobMetric", () => {
    it("should record job metrics", async () => {
      const jobName = "test-job";
      const status = "completed";
      const duration = 200;
      const record = jest.spyOn(service as any, "record");
      await service.recordJobMetric(jobName, status, duration);
      expect(record).toHaveBeenCalled();
    });
  });
});
