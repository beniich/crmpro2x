import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';

@Controller('medical-records')
export class MedicalRecordsController {
    constructor(private readonly medicalRecordsService: MedicalRecordsService) { }

    @Post()
    create(@Body() createMedicalRecordDto: CreateMedicalRecordDto) {
        const mockDoctorId = 'dr_001'; // In real app, get from request user (JWT)
        return this.medicalRecordsService.create(createMedicalRecordDto, mockDoctorId);
    }

    @Get('patient/:patientId')
    findByPatient(@Param('patientId') patientId: string) {
        return this.medicalRecordsService.findByPatient(patientId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.medicalRecordsService.findOne(id);
    }

    @Put(':id/lock')
    lock(@Param('id') id: string) {
        const mockDoctorId = 'dr_001';
        return this.medicalRecordsService.lockRecord(id, mockDoctorId);
    }
}
