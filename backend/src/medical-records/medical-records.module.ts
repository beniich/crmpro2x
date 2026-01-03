import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecord, MedicalRecordSchema } from './schemas/medical-record.schema';
import { MedicalRecordsService } from './medical-records.service';
import { MedicalRecordsController } from './medical-records.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: MedicalRecord.name, schema: MedicalRecordSchema }])
    ],
    controllers: [MedicalRecordsController],
    providers: [MedicalRecordsService],
    exports: [MedicalRecordsService],
})
export class MedicalRecordsModule { }
