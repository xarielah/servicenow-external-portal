import { Module } from '@nestjs/common';
import { ServiceNowModule } from '../service-now/service-now.module';
import { AnnouncementsController } from './announcements.controller.v1';
import { AnnouncementsService } from './announcements.service';

@Module({
  imports: [ServiceNowModule],
  providers: [AnnouncementsService],
  controllers: [AnnouncementsController],
})
export class AnnouncementsModule {}
