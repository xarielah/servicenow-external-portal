import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { OptionDto } from './option.dto';

export class TemplateFieldDto {
  @Expose({ name: 'sys_id' })
  @ApiProperty({ description: 'DB unique ID of the field' })
  id: string;

  @Expose({ name: 'question_text' })
  @ApiProperty({ description: 'Name of the field' })
  text: string;

  @Expose({ name: 'type' })
  @ApiProperty({ description: 'Type of the field' })
  type: string;

  @Expose({ name: 'mandatory' })
  @ApiProperty({ description: 'Is the field mandatory' })
  mandatory: boolean;

  @Expose({ name: 'name' })
  @ApiProperty({ description: 'Name of the template' })
  name: string;

  @Expose({ name: 'cat_item.sys_id' })
  @ApiProperty({ description: 'Unique numeric ID of the template' })
  templateId: string;

  @Expose({ name: 'u_external_classname' })
  @ApiProperty({ description: 'Classname of the field' })
  className: string;

  @Expose({ name: 'options' })
  @ApiProperty({ description: 'Options for the field' })
  options: OptionDto[] | null;
}
