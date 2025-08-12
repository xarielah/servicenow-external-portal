import { ApiProperty } from '@nestjs/swagger';

export class OptionDto {
  @ApiProperty({ description: 'DB unique ID of the option' })
  id: string;

  @ApiProperty({ description: 'Options label' })
  text: string;

  @ApiProperty({ description: 'Unique value of the option' })
  value: string;
}
