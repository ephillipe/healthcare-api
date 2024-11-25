import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { parse } from "csv-parse/sync";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Appointment } from "./schemas/appointment.schema";
import { MetricsService } from "../metrics/metrics.service";

@Processor("appointments")
export class AppointmentsProcessor extends WorkerHost {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private metricsService: MetricsService
  ) {
    super();
  }
  async process(job: Job<{ csvContent: string }>) {
    return this.processCsv(job.data.csvContent, job);
  }

  async processCsv(csvContent: string, job: Job) {
    const startTime = Date.now();
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const totalRecords = records.length;
    let processedRecords = 0;

    for (const record of records) {
      await this.appointmentModel.create({
        id: parseInt(record.id),
        patient_id: parseInt(record.patient_id),
        doctor: record.doctor,
        appointment_date: new Date(record.appointment_date),
        reason: record.reason,
      });

      processedRecords++;
      const progress = (processedRecords / totalRecords) * 100;
      await job.updateProgress(progress);

      await this.metricsService.recordJobMetric(
        "process-csv",
        "completed",
        Date.now() - startTime
      );
    }

    return { processed: processedRecords };
  }

  @OnWorkerEvent("completed")
  onCompleted() {
    // do some stuff
  }
}
