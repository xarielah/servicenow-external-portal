import { Module } from '@nestjs/common';
import { ServiceNowModule } from '../service-now/service-now.module';
import { IncidentControllerV1 } from './incident.controller.v1';
import { IncidentService } from './incident.service';

@Module({
  controllers: [IncidentControllerV1],
  providers: [IncidentService],
  imports: [ServiceNowModule],
})
export class IncidentModule {}
