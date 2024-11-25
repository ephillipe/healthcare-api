import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PatientsService } from "./patients.service";
import { Patient } from "./schemas/patient.schema";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { maxLength } from "class-validator";
import { ConfigService } from "@nestjs/config";

const mockPatient = (id: number, name: string): Partial<Patient> => ({
  _id: id.toString(),
  name,
  age: 30,
  contact: "123-456-7890",
  gender: "male",
  id: id,
  // Add other required properties and methods here
});

const mockPatientModel = {
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([mockPatient(1, "John Doe")]),
  }),
  findOne: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPatient(1, "John Doe")),
    }),
  }),
  create: jest.fn().mockResolvedValue(mockPatient(1, "John Doe")),
  save: jest.fn().mockResolvedValue(mockPatient(1, "John Doe")),
  exec: jest.fn().mockResolvedValue(mockPatient(1, "John Doe")),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case "INFLUXDB_URL":
        return "http://localhost:8086";
      case "INFLUXDB_TOKEN":
        return "my-token";
      case "INFLUXDB_ORG":
        return "my-org";
      case "INFLUXDB_BUCKET":
        return "my-bucket";
      default:
        return null;
    }
  }),
};

describe("PatientsService", () => {
  let service: PatientsService;
  let model: Model<Patient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientsService,
        {
          provide: getModelToken(Patient.name),
          useValue: mockPatientModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    model = module.get<Model<Patient>>(getModelToken(Patient.name));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a patient", async () => {
    const createPatientDto: CreatePatientDto = {
      name: "John Doe",
      age: 30,
      contact: "123-456-7890",
      gender: "male",
    };
    const createFn = jest
      .spyOn(service, "create")
      .mockResolvedValue(mockPatient(1, "John Doe") as Patient);
    const result = await service.create(createPatientDto);
    expect(result).toEqual(mockPatient(1, "John Doe"));
    expect(createFn).toHaveBeenCalledWith(createPatientDto);
  });

  it("should return all patients", async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockPatient(1, "John Doe")]);
    expect(model.find).toHaveBeenCalled();
  });
});
