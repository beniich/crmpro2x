import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
class Vitals {
    @Prop()
    weight: number; // kg

    @Prop()
    height: number; // cm

    @Prop()
    bloodPressure: string; // e.g. 120/80

    @Prop()
    temperature: number; // C

    @Prop()
    heartRate: number; // bpm
}

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
    patientId: Types.ObjectId;

    @Prop({ required: true })
    doctorId: string;

    @Prop({ required: true })
    visitDate: Date;

    @Prop({ required: true })
    chiefComplaint: string;

    @Prop()
    clinicalNotes: string;

    @Prop({ type: Vitals })
    vitals: Vitals;

    @Prop([String])
    diagnosis: string[];

    @Prop({
        type: [{
            medication: String,
            dosage: String,
            frequency: String,
            duration: String,
            notes: String
        }]
    })
    prescriptions: any[];

    @Prop({
        type: [{
            testName: String,
            result: String,
            unit: String,
            referenceRange: String,
            status: { type: String, enum: ['pending', 'final', 'abnormal'] }
        }]
    })
    labResults: any[];

    @Prop({ default: false })
    isLocked: boolean; // For medical audit compliance
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
