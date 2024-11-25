import { Document } from 'mongoose';
export declare class Patient extends Document {
    id: number;
    name: string;
    age: number;
    gender: string;
    contact: string;
}
export declare const PatientSchema: import("mongoose").Schema<Patient, import("mongoose").Model<Patient, any, any, any, Document<unknown, any, Patient> & Patient & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Patient, Document<unknown, {}, import("mongoose").FlatRecord<Patient>> & import("mongoose").FlatRecord<Patient> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
