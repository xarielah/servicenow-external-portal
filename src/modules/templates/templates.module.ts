import { Module } from '@nestjs/common';
import { ServiceNowModule } from '../service-now/service-now.module';
import { TemplatesControllerV1 } from './templates.controller.v1';
import { TemplatesService } from './templates.service';

@Module({
  providers: [TemplatesService],
  controllers: [TemplatesControllerV1],
  imports: [ServiceNowModule],
})
export class TemplatesModule {}
