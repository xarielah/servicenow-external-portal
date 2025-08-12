import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TemplateKnowledgeDto {
  @Expose({ name: 'sys_id' })
  @ApiProperty({ description: 'DB unique ID of the knowledge article' })
  id: string;

  @Expose({ name: 'u_name' })
  @ApiProperty({ description: 'Name of the knowledge article' })
  name: string;

  @Expose({ name: 'u_short_description' })
  @ApiProperty({ description: 'Short description of the knowledge article' })
  u_short_description: string;

  @Expose({ name: 'u_url' })
  @ApiProperty({ description: 'URL of the knowledge article' })
  u_url: string;
}
