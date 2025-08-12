import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TemplateDto {
  @Expose({ name: 'sys_id' })
  @ApiProperty({ description: 'DB unique ID of the template' })
  id: string;

  @Expose({ name: 'name' })
  @ApiProperty({ description: 'Name of the template form' })
  name: string;

  @Expose({ name: 'short_description' })
  @ApiProperty({ description: 'Short description of the template form' })
  description?: string | null;

  @Expose({ name: 'u_id' })
  @ApiProperty({ description: 'Unique umeric ID of the template form' })
  system_id: string;
}
