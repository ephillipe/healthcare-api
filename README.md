# Healthcare API

A NestJS-based healthcare API for managing patient records and appointments.

## Features

- Patient management
- Appointment scheduling via CSV upload
- Queue-based CSV processing
- Metrics collection with InfluxDB
- Grafana dashboards for monitoring
- Load testing with k6

## Running Locally

1. Start the application using Docker Compose:

```bash
docker-compose up -d
```

2. The following services will be available:

- API: http://localhost:3000
- Grafana: http://localhost:3001
- InfluxDB: http://localhost:8086

## API Endpoints

### Patients

- `POST /patients` - Create a new patient
- `GET /patients` - Get all patients
- `GET /patients/:id` - Get a specific patient

### Appointments

- `POST /appointments` - Upload appointments CSV
- `GET /appointments` - Get all appointments (optional query params: patient_id, doctor)
- `GET /appointments/:id` - Get a specific appointment

## Models

### Patient

```typescript
{
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
}
```

### Appointment

```typescript
{
  id: number;
  patient_id: number;
  doctor: string;
  appointment_date: string;
  reason: string;
}
```

## Load Testing

Run k6 load tests:

```bash
docker-compose run k6 run /scripts/http.js
```

## Uploading Appointments

Use the provided script to upload appointments:

```bash
ts-node scripts/upload-appointments.ts path/to/appointments.csv
```