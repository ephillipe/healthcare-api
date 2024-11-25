import axios from "axios";
import * as fs from "fs";
import * as FormData from "form-data";

const uploadAppointments = async (filePath: string) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  try {
    const response = await axios.post(
      "http://localhost:3000/appointments",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    console.log("Upload successful:", response.data);
  } catch (error) {
    console.error("Upload failed:", error.response?.data || error.message);
  }
};

// Usage: ts-node upload-appointments.ts <path-to-csv>
const filePath = process.argv[2];
if (!filePath) {
  console.error("Please provide a path to the CSV file");
  process.exit(1);
}

uploadAppointments(filePath);
