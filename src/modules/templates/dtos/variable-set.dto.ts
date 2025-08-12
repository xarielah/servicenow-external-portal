import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class VariableSetDto {
  @Expose({ name: 'variable_set.sys_id' })
  @ApiProperty({ description: 'DB unique ID of the variable set' })
  id: string;

  @Expose({ name: 'sc_cat_item.name' })
  @ApiProperty({ description: 'Name of the variable set' })
  name: string;

  @Expose({ name: 'sc_cat_item.u_id' })
  @ApiProperty({
    description: 'Unique numeric ID of the cat item / producer template',
  })
  system_id: string;
}
