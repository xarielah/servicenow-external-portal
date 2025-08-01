import { Module } from '@nestjs/common';
import { ServiceNowModule } from '../service-now/service-now.module';
import { TemplatesModule } from '../templates/templates.module';
import { TemplatesService } from '../templates/templates.service';
import { FormsControllerV1 } from './forms.controller.v1';
import { FormsService } from './forms.service';

@Module({
  imports: [ServiceNowModule, TemplatesModule],
  providers: [FormsService, TemplatesService],
  controllers: [FormsControllerV1],
})
export class FormsModule {}
