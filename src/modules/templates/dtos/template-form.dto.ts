import { ApiProperty } from '@nestjs/swagger';
import { TemplateFieldDto } from './template-field.dto';
import { TemplateDto } from './template.dto';

export class TemplateFormDto extends TemplateDto {
  @ApiProperty({ description: 'Fields for the template form' })
  fields: TemplateFieldDto[];
}
