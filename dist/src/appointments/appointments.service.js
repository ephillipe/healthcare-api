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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bull_1 = require("@nestjs/bull");
const bullmq_1 = require("bullmq");
const appointment_schema_1 = require("./schemas/appointment.schema");
const metrics_service_1 = require("../metrics/metrics.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentModel, appointmentsQueue, metricsService) {
        this.appointmentModel = appointmentModel;
        this.appointmentsQueue = appointmentsQueue;
        this.metricsService = metricsService;
    }
    async findAll(filters) {
        const query = {};
        if (filters?.patient_id)
            query['patient_id'] = filters.patient_id;
        if (filters?.doctor)
            query['doctor'] = filters.doctor;
        return this.appointmentModel.find(query).exec();
    }
    async findOne(id) {
        const appointment = await this.appointmentModel.findOne({ id }).exec();
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        return appointment;
    }
    async processAppointmentsCsv(csvContent) {
        const jobId = await this.appointmentsQueue.add('process-csv', {
            csvContent,
        }, {
            removeOnComplete: true,
        });
        return jobId.id;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(1, (0, bull_1.InjectQueue)('appointments')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        bullmq_1.Queue,
        metrics_service_1.MetricsService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map