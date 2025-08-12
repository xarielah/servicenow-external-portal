import { Module } from '@nestjs/common';
import { ServiceNowModule } from '../service-now/service-now.module';
import { AnnouncementsControllerV1 } from './announcements.controller.v1';
import { AnnouncementsService } from './announcements.service';

@Module({
  imports: [ServiceNowModule],
  providers: [AnnouncementsService],
  controllers: [AnnouncementsControllerV1],
})
export class AnnouncementsModule {}
