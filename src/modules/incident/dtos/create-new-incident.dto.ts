import { IsObject, IsString } from 'class-validator';

export class CreateNewIncidentDto {
  @IsString({ message: 'type is missing or invalid' })
  type: string;

  @IsObject({ message: 'payload is missing or invalid' })
  payload: object;
}
