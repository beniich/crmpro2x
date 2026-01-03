import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicalRecord } from './schemas/medical-record.schema';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { DatabaseService } from '../database/database.service';
import { AuditService } from '../shared/audit/audit.service';

@Injectable()
export class MedicalRecordsService {
    constructor(
        @InjectModel(MedicalRecord.name) private medicalRecordModel: Model<MedicalRecord>,
        private db: DatabaseService,
        private audit: AuditService,
    ) { }

    async create(createMedicalRecordDto: CreateMedicalRecordDto, doctorId: string): Promise<MedicalRecord> {
        try {
            const createdRecord = new this.medicalRecordModel({
                ...createMedicalRecordDto,
                doctorId,
                visitDate: new Date(),
            });
            const savedRecord = await createdRecord.save();
            this.audit.log('CREATE_MEDICAL_RECORD', doctorId, `ID: ${savedRecord._id}`);
            return savedRecord;
        } catch (e) {
            const conn = await this.db.getConnection();
            const saved = await conn.insert('medicalRecords', { ...createMedicalRecordDto, doctorId });
            this.audit.log('CREATE_MEDICAL_RECORD', doctorId, `ID: ${saved._id}`);
            return saved;
        }
    }

    async findByPatient(patientId: string): Promise<MedicalRecord[]> {
        try {
            return await this.medicalRecordModel.find({ patientId }).sort({ visitDate: -1 }).exec();
        } catch (e) {
            const conn = await this.db.getConnection();
            return conn.find('medicalRecords', { patientId });
        }
    }

    async findOne(id: string): Promise<MedicalRecord> {
        let record;
        try {
            record = await this.medicalRecordModel.findById(id).exec();
        } catch (e) {
            const conn = await this.db.getConnection();
            record = await conn.findById('medicalRecords', id);
        }

        if (!record) {
            throw new NotFoundException(`Medical record with ID ${id} not found`);
        }
        return record;
    }

    async lockRecord(id: string, doctorId: string): Promise<MedicalRecord> {
        try {
            return await this.medicalRecordModel.findByIdAndUpdate(id, { isLocked: true }, { new: true }).exec();
        } catch (e) {
            const conn = await this.db.getConnection();
            return conn.update('medicalRecords', id, { isLocked: true });
        }
    }
}
