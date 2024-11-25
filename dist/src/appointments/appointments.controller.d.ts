import { AppointmentsService } from './appointments.service';
import { Appointment } from './schemas/appointment.schema';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    findAll(patient_id?: number, doctor?: string): Promise<Appointment[]>;
    findOne(id: string): Promise<Appointment>;
    uploadFile(file: Express.Multer.File): Promise<string>;
}
