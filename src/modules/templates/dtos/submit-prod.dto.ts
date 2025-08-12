import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class SubmitProducerDto {
  @IsString()
  @ApiProperty({ description: 'Template ID' })
  templateId: string;

  @IsObject()
  @ApiProperty({ description: 'Variables to be submitted' })
  variables: Record<string, string>;
}
