import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from './schemas/appointment.schema';
import { DatabaseService } from '../database/database.service';
import { AuditService } from '../shared/audit/audit.service';

@Injectable()
export class AppointmentsService {
    constructor(
        @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
        private db: DatabaseService,
        private audit: AuditService,
    ) { }

    async create(data: any, doctorId: string): Promise<Appointment> {
        try {
            const createdAppointment = new this.appointmentModel({ ...data, doctorId });
            const saved = await createdAppointment.save();
            this.audit.log('CREATE_APPOINTMENT', doctorId, `ID: ${saved._id}`);
            return saved;
        } catch (e) {
            const conn = await this.db.getConnection();
            const saved = await conn.insert('appointments', { ...data, doctorId });
            this.audit.log('CREATE_APPOINTMENT', doctorId, `ID: ${saved._id}`);
            return saved;
        }
    }

    async findAll(): Promise<Appointment[]> {
        try {
            return await this.appointmentModel.find().populate('patientId').exec();
        } catch (e) {
            const conn = await this.db.getConnection();
            return conn.find('appointments');
        }
    }

    async findByPatient(patientId: string): Promise<Appointment[]> {
        try {
            return await this.appointmentModel.find({ patientId }).exec();
        } catch (e) {
            const conn = await this.db.getConnection();
            return conn.find('appointments', { patientId });
        }
    }

    async updateStatus(id: string, status: string, doctorId: string): Promise<Appointment> {
        try {
            const appointment = await this.appointmentModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
            if (!appointment) throw new NotFoundException(`Appointment ${id} not found`);
            this.audit.log('UPDATE_APPOINTMENT_STATUS', doctorId, `ID: ${id} to ${status}`);
            return appointment;
        } catch (e) {
            const conn = await this.db.getConnection();
            const updated = await conn.update('appointments', id, { status });
            this.audit.log('UPDATE_APPOINTMENT_STATUS', doctorId, `ID: ${id} to ${status}`);
            return updated;
        }
    }
}
