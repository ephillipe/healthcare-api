import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 20 },
    { duration: "30s", target: 0 },
  ],
};

export default function () {
  const BASE_URL = "http://api:3000";

  // Test GET /patients
  const patientsRes = http.get(`${BASE_URL}/patients`);
  check(patientsRes, {
    "patients status was 200": (r) => r.status === 200,
  });

  // Test GET /appointments
  const appointmentsRes = http.get(`${BASE_URL}/appointments`);
  check(appointmentsRes, {
    "appointments status was 200": (r) => r.status === 200,
  });

  sleep(1);
}
