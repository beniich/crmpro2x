import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
    patientId: Types.ObjectId;

    @Prop({ required: true })
    doctorId: string;

    @Prop({ required: true })
    dateTime: Date;

    @Prop({ default: 30 })
    duration: number; // in minutes

    @Prop({ enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'no-show'], default: 'scheduled' })
    status: string;

    @Prop({ enum: ['consultation', 'follow-up', 'emergency', 'surgery', 'pre-op'], default: 'consultation' })
    type: string;

    @Prop()
    location: string; // Room number or 'Telemedicine'

    @Prop()
    reason: string;

    @Prop()
    notes: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
