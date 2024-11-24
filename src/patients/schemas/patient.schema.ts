import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Patient extends Document {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  contact: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);