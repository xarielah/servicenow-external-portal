import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class TemplatesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @Max(100)
  @Min(1)
  @IsNumber()
  limit: number = 5;
}
