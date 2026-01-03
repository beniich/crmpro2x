import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schemas/patient.schema';
import { DatabaseService } from '../database/database.service';
import { AuditService } from '../shared/audit/audit.service';

@Injectable()
export class PatientsService {
    constructor(
        @InjectModel(Patient.name) private patientModel: Model<Patient>,
        private db: DatabaseService,
        private audit: AuditService,
    ) { }

    private async getModel() {
        // This is a bridge. In a real large app we'd use a more formal repository pattern.
        return this.patientModel;
    }

    async findAll(): Promise<Patient[]> {
        try {
            return await this.patientModel.find().exec();
        } catch (e) {
            const conn = await this.db.getConnection();
            return conn.find('patients');
        }
    }

    async findOne(id: string): Promise<Patient> {
        let patient;
        try {
            patient = await this.patientModel.findById(id).exec();
        } catch (e) {
            const conn = await this.db.getConnection();
            patient = await conn.findById('patients', id);
        }

        if (!patient) {
            throw new NotFoundException(`Patient with ID ${id} not found`);
        }
        this.audit.log('ACCESS_PATIENT_RECORD', 'SYSTEM', id);
        return patient;
    }

    async create(data: any): Promise<Patient> {
        try {
            const createdPatient = new this.patientModel(data);
            const savedPatient = await createdPatient.save();
            this.audit.log('CREATE_PATIENT', 'SYSTEM', (savedPatient as any).id || (savedPatient as any)._id);
            return savedPatient;
        } catch (e) {
            const conn = await this.db.getConnection();
            const saved = await conn.insert('patients', data);
            this.audit.log('CREATE_PATIENT', 'SYSTEM', saved._id);
            return saved;
        }
    }
}
