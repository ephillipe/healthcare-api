"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsProcessor = void 0;
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const sync_1 = require("csv-parse/sync");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const appointment_schema_1 = require("./schemas/appointment.schema");
const metrics_service_1 = require("../metrics/metrics.service");
let AppointmentsProcessor = class AppointmentsProcessor {
    constructor(appointmentModel, metricsService) {
        this.appointmentModel = appointmentModel;
        this.metricsService = metricsService;
    }
    async processCsv(job) {
        const records = (0, sync_1.parse)(job.data.csvContent, {
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
            this.metricsService.recordJobProgress(job.id, progress);
        }
        return { processed: processedRecords };
    }
};
exports.AppointmentsProcessor = AppointmentsProcessor;
__decorate([
    (0, bull_1.Process)('process-csv'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_1.Job]),
    __metadata("design:returntype", Promise)
], AppointmentsProcessor.prototype, "processCsv", null);
exports.AppointmentsProcessor = AppointmentsProcessor = __decorate([
    (0, bull_1.Processor)('appointments'),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        metrics_service_1.MetricsService])
], AppointmentsProcessor);
//# sourceMappingURL=appointments.processor.js.map