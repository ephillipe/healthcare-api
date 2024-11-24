import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Appointment extends Document {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  patient_id: number;

  @Prop({ required: true })
  doctor: string;

  @Prop({ required: true })
  appointment_date: Date;

  @Prop({ required: true })
  reason: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);