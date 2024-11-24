import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const lastPatient = await this.patientModel
      .findOne()
      .sort({ id: -1 })
      .exec();
    const id = lastPatient ? lastPatient.id + 1 : 1;

    const patient = new this.patientModel({
      ...createPatientDto,
      id,
    });
    return patient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientModel.findOne({ id }).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }
}