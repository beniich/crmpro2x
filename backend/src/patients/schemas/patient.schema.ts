import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Patient extends Document {
    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    phone: string;

    @Prop({ required: true })
    dateOfBirth: Date;

    @Prop({ enum: ['M', 'F', 'Other'] })
    gender: string;

    @Prop()
    bloodType: string;

    @Prop([String])
    allergies: string[];

    @Prop([String])
    chronicConditions: string[];

    @Prop({ type: Object })
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };

    @Prop({ default: 'active' })
    status: string;

    @Prop()
    socialSecurityNumber: string; // Encrypted in real prod
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
