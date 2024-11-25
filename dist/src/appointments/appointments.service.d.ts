import { Model } from 'mongoose';
import { Queue } from 'bullmq';
import { Appointment } from './schemas/appointment.schema';
import { MetricsService } from '../metrics/metrics.service';
export declare class AppointmentsService {
    private appointmentModel;
    private appointmentsQueue;
    private metricsService;
    constructor(appointmentModel: Model<Appointment>, appointmentsQueue: Queue, metricsService: MetricsService);
    findAll(filters?: {
        patient_id?: number;
        doctor?: string;
    }): Promise<Appointment[]>;
    findOne(id: number): Promise<Appointment>;
    processAppointmentsCsv(csvContent: string): Promise<string>;
}
