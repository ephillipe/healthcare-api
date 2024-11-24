import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { Appointment } from './schemas/appointment.schema';
import { MetricsService } from '../metrics/metrics.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectQueue('appointments') private appointmentsQueue: Queue,
    private metricsService: MetricsService,
  ) {}

  async findAll(filters?: { patient_id?: number; doctor?: string }): Promise<Appointment[]> {
    const query = {};
    if (filters?.patient_id) query['patient_id'] = filters.patient_id;
    if (filters?.doctor) query['doctor'] = filters.doctor;
    return this.appointmentModel.find(query).exec();
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentModel.findOne({ id }).exec();
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async processAppointmentsCsv(csvContent: string): Promise<string> {
    const jobId = await this.appointmentsQueue.add('process-csv', {
      csvContent,
    }, {
      removeOnComplete: true,
    });

    return jobId.id;
  }
}