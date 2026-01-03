import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
    constructor(private readonly patientsService: PatientsService) { }

    @Get()
    findAll() {
        return this.patientsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.patientsService.findOne(id);
    }

    @Post()
    create(@Body() createPatientDto: any) {
        return this.patientsService.create(createPatientDto);
    }
}
