import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TemplateFieldDto } from './template-field.dto';
import { TemplateDto } from './template.dto';

export class TemplateFormDto extends TemplateDto {
  @Expose({ name: 'fields' })
  @ApiProperty({ description: 'Fields for the template form' })
  fields: TemplateFieldDto[];
}
