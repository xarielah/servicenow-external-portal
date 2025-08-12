import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class OptionDto {
  @Expose({ name: 'sys_id' })
  @ApiProperty({ description: 'DB unique ID of the option' })
  id: string;

  @Expose({ name: 'text' })
  @ApiProperty({ description: 'Options label' })
  text: string;

  @Expose({ name: 'value' })
  @ApiProperty({ description: 'Unique value of the option' })
  value: string;
}
