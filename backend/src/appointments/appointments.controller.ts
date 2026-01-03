import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    create(@Body() data: any) {
        const mockDoctorId = 'dr_001';
        return this.appointmentsService.create(data, mockDoctorId);
    }

    @Get()
    findAll() {
        return this.appointmentsService.findAll();
    }

    @Get('patient/:patientId')
    findByPatient(@Param('patientId') patientId: string) {
        return this.appointmentsService.findByPatient(patientId);
    }

    @Put(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        const mockDoctorId = 'dr_001';
        return this.appointmentsService.updateStatus(id, status, mockDoctorId);
    }
}
