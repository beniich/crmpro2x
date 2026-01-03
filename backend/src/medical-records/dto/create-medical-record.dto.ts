import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class VitalsDto {
    @IsNumber() @IsOptional() weight?: number;
    @IsNumber() @IsOptional() height?: number;
    @IsString() @IsOptional() bloodPressure?: string;
    @IsNumber() @IsOptional() temperature?: number;
    @IsNumber() @IsOptional() heartRate?: number;
}

export class CreateMedicalRecordDto {
    @IsString() @IsNotEmpty()
    patientId: string;

    @IsString() @IsNotEmpty()
    chiefComplaint: string;

    @IsString() @IsOptional()
    clinicalNotes?: string;

    @IsObject() @IsOptional()
    @ValidateNested()
    @Type(() => VitalsDto)
    vitals?: VitalsDto;

    @IsArray() @IsString({ each: true }) @IsOptional()
    diagnosis?: string[];

    @IsArray() @IsOptional()
    prescriptions?: any[];

    @IsArray() @IsOptional()
    labResults?: any[];
}
