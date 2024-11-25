"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const uploadAppointments = async (filePath) => {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    try {
        const response = await axios_1.default.post('http://localhost:3000/appointments', form, {
            headers: {
                ...form.getHeaders(),
            },
        });
        console.log('Upload successful:', response.data);
    }
    catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
    }
};
const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide a path to the CSV file');
    process.exit(1);
}
uploadAppointments(filePath);
//# sourceMappingURL=upload-appointments.js.map