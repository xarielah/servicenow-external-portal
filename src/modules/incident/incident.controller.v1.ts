import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { CreateNewIncidentDto } from './dtos/create-new-incident.dto';
import { IncidentService } from './incident.service';

@Controller({ path: 'incident', version: '1' })
export class IncidentControllerV1 {
  constructor(private readonly incidentService: IncidentService) {}

  logger = new Logger(IncidentControllerV1.name);

  @Post('/new')
  @HttpCode(HttpStatus.CREATED)
  async createNewIncident(@Body() createNewIncidentDto: CreateNewIncidentDto) {
    try {
      const { type, payload } = createNewIncidentDto;
      const res = await this.incidentService.create({ type, payload });
      return { result: res.result };
    } catch (error) {
      this.logger.error('createNewIncident: ' + error);
      throw new BadRequestException();
    }
  }
}
