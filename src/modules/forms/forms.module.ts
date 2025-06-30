import { Module } from '@nestjs/common';
import { ServiceNowModule } from '../service-now/service-now.module';
import { FormsControllerV1 } from './forms.controller.v1';
import { FormsService } from './forms.service';

@Module({
  imports: [ServiceNowModule],
  providers: [FormsService],
  controllers: [FormsControllerV1],
})
export class FormsModule {}
