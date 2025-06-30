import { IsObject, IsString } from 'class-validator';

export class SubmitRecordProducerDto {
  @IsString({ message: 'templateId is missing or invalid' })
  templateId: string;

  @IsObject({ message: 'variables is missing or invalid' })
  variables: object;
}
