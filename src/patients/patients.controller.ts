import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './schemas/patient.schema';

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Patient created successfully' })
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all patients' })
  async findAll(): Promise<Patient[]> {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a patient by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the patient' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Patient not found' })
  async findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientsService.findOne(Number(id));
  }
}