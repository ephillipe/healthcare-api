import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
  UseInterceptors, 
  UploadedFile,
  HttpStatus 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiResponse, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './schemas/appointment.schema';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all appointments' })
  async findAll(
    @Query('patient_id') patient_id?: number,
    @Query('doctor') doctor?: string,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findAll({ patient_id, doctor });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an appointment by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the appointment' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Appointment not found' })
  async findOne(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.findOne(Number(id));
  }

  @Post()
  @ApiOperation({ summary: 'Upload appointments CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: HttpStatus.OK, description: 'File processed successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const csvContent = file.buffer.toString();
    return this.appointmentsService.processAppointmentsCsv(csvContent);
  }
}