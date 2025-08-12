import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementDto } from './dto/announcement.dto';

@Controller({ path: 'announcements', version: '1' })
export class AnnouncementsControllerV1 {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  private readonly logger = new Logger(AnnouncementsControllerV1.name);

  @Post('/')
  @ApiOperation({ summary: 'Get announcements' })
  @HttpCode(HttpStatus.OK)
  async getAnnouncements() {
    try {
      const announcements = await this.announcementsService.getAnnouncements();

      const transformed = plainToInstance(AnnouncementDto, announcements);

      return transformed;
    } catch (error) {
      this.logger.error('getAnnouncements:' + error);
      throw new BadRequestException(error);
    }
  }
}
