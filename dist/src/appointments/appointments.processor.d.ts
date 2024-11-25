import { Job } from 'bullmq';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { MetricsService } from '../metrics/metrics.service';
export declare class AppointmentsProcessor {
    private appointmentModel;
    private metricsService;
    constructor(appointmentModel: Model<Appointment>, metricsService: MetricsService);
    processCsv(job: Job<{
        csvContent: string;
    }>): Promise<{
        processed: number;
    }>;
}
