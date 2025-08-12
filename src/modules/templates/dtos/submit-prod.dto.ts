import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class SubmitProducerDto {
  @IsString({ message: 'template number is missing or invalid' })
  @ApiProperty({ description: 'Template ID' })
  templateId: string;

  @IsObject({ message: 'variables are missing or invalid' })
  @ApiProperty({ description: 'Variables to be submitted' })
  variables: Record<string, string>;
}
