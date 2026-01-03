import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Medication extends Document {
    @Prop({ required: true, unique: true })
    code: string; // Internal or ATC code

    @Prop({ required: true })
    name: string;

    @Prop()
    genericName: string;

    @Prop()
    manufacturer: string;

    @Prop({ enum: ['tablet', 'capsule', 'injection', 'syrup', 'ointment', 'inhaler'] })
    dosageForm: string;

    @Prop()
    strength: string; // e.g. 500mg

    @Prop([String])
    indications: string[];

    @Prop([String])
    contraindications: string[];

    @Prop({ default: true })
    isActive: boolean;
}

export const MedicationSchema = SchemaFactory.createForClass(Medication);
