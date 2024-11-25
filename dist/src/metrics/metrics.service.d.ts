import { ConfigService } from '@nestjs/config';
export declare class MetricsService {
    private configService;
    private influxDB;
    private org;
    private bucket;
    constructor(configService: ConfigService);
    recordHttpRequest(data: {
        method: string;
        path: string;
        statusCode: number;
        duration: number;
    }): void;
    recordJobProgress(jobId: string, progress: number): void;
}
