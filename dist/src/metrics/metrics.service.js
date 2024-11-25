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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const influxdb_client_1 = require("@influxdata/influxdb-client");
const config_1 = require("@nestjs/config");
let MetricsService = class MetricsService {
    constructor(configService) {
        this.configService = configService;
        const url = this.configService.get('INFLUXDB_URL');
        const token = this.configService.get('INFLUXDB_TOKEN');
        this.org = this.configService.get('INFLUXDB_ORG');
        this.bucket = this.configService.get('INFLUXDB_BUCKET');
        this.influxDB = new influxdb_client_1.InfluxDB({ url, token });
    }
    recordHttpRequest(data) {
        const point = new influxdb_client_1.Point('http_request')
            .tag('method', data.method)
            .tag('path', data.path)
            .tag('status_code', data.statusCode.toString())
            .floatField('duration_ms', data.duration);
        const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
        writeApi.writePoint(point);
        writeApi.close();
    }
    recordJobProgress(jobId, progress) {
        const point = new influxdb_client_1.Point('job_progress')
            .tag('job_id', jobId)
            .floatField('progress', progress);
        const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
        writeApi.writePoint(point);
        writeApi.close();
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map