import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricsService {
  private influxDB: InfluxDB;
  private org: string;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('INFLUXDB_URL');
    const token = this.configService.get<string>('INFLUXDB_TOKEN');
    this.org = this.configService.get<string>('INFLUXDB_ORG');
    this.bucket = this.configService.get<string>('INFLUXDB_BUCKET');

    this.influxDB = new InfluxDB({ url, token });
  }

  recordHttpRequest(data: {
    method: string;
    path: string;
    statusCode: number;
    duration: number;
  }) {
    const point = new Point('http_request')
      .tag('method', data.method)
      .tag('path', data.path)
      .tag('status_code', data.statusCode.toString())
      .floatField('duration_ms', data.duration);

    const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
    writeApi.writePoint(point);
    writeApi.close();
  }

  recordJobProgress(jobId: string, progress: number) {
    const point = new Point('job_progress')
      .tag('job_id', jobId)
      .floatField('progress', progress);

    const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
    writeApi.writePoint(point);
    writeApi.close();
  }
}