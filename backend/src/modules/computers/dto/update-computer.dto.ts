import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateComputerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;
}
