import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AnnouncementDto {
  @Expose({ name: 'sys_id' })
  @ApiProperty({
    description: 'System unique ID string',
    example: 'c4f0c3c0a3a711edb9d90242ac120002',
  })
  id: string;

  @Expose({ name: 'title' })
  @ApiProperty({
    description: 'Title of the announcement',
    example: 'Announcement title',
  })
  title?: string;

  @Expose({ name: 'summary' })
  @ApiProperty({
    description: 'Summary of the announcement',
    example: 'Announcement summary',
  })
  summary: string;

  @Expose({ name: 'u_external_goto' })
  @ApiProperty({
    description: 'URL to redirect to when clicking on the announcement',
    example: 'https://www.google.com',
  })
  goto?: string;
}
