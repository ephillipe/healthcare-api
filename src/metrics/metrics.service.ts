import { Injectable } from "@nestjs/common";
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MetricsService {
  private influx: InfluxDB;
  private org: string;
  private bucket: string;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>("INFLUXDB_URL");
    const token = this.configService.get<string>("INFLUXDB_TOKEN");
    this.org = this.configService.get<string>("INFLUXDB_ORG");
    this.bucket = this.configService.get<string>("INFLUXDB_BUCKET");

    this.influx = new InfluxDB({ url, token });
  }

  private record(point: Point) {
    const writeApi = this.influx.getWriteApi(this.org, this.bucket);
    writeApi.writePoint(point);
    writeApi.close();
  }

  recordApiMetric(data: {
    method: string;
    path: string;
    statusCode: number;
    duration: number;
  }) {
    const point = new Point("http_request")
      .tag("method", data.method)
      .tag("path", data.path)
      .tag("status_code", data.statusCode.toString())
      .floatField("duration_ms", data.duration);

    this.record(point);
  }

  async recordJobMetric(jobName: string, status: string, duration: number) {
    const point = new Point("job_execution")
      .tag("job_name", jobName)
      .tag("status", status)
      .floatField("duration_ms", duration);

    this.record(point);
  }
}
