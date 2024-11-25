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
docker-compose up -d --build
```

2. The following services will be available:

- API: http://localhost:3000/api
- Grafana: http://localhost:3001
  - Credentials admin/admin
  - The dashboard are available inthe folder grafana/dashboard and need to be imported to be used.
- InfluxDB: http://localhost:8086
  - Credentials: admin/adminpassword

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
ts-node scripts/upload-appointments.ts sample-appointments.csv
```

## TODO improvments

- We can consider spliting the CSV upload. However, we should evaluate the network increase and microservice administrations. As CSV and Appointments are inside the same scope I considered they can live in the same microservice.
- The queueing was built using BullMQ, a simple NodeJS/Redis task manager. In case of be required, RabbitMQ can be a good replacement.
- For monitoring, I have used InfluxDB because it's designed to keep records for business and performance metrics. As a alternative we could use Prometheus,but it is primarily designed to track cloud-first metrics.
