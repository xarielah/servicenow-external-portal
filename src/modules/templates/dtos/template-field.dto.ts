import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
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
  @Transform(({ value }) => value === 'true')
  mandatory: boolean;

  @Expose({ name: 'name' })
  @ApiProperty({ description: 'Name of the template' })
  name: string;

  @Expose({ name: 'u_external_classname' })
  @ApiProperty({ description: 'Classname of the field' })
  className: string;

  @Expose({ name: 'validate_regex' })
  @ApiProperty({ description: 'Validation of the field' })
  validation?: string;

  @Expose({ name: 'options' })
  @ApiProperty({ description: 'Options for the field' })
  options: OptionDto[] | null;
}
