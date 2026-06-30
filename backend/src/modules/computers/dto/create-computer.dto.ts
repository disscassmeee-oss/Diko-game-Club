import { IsString, IsIP, IsOptional, IsNumber } from 'class-validator';

export class CreateComputerDto {
  @IsString()
  name: string;

  @IsIP()
  ipAddress: string;

  @IsOptional()
  @IsString()
  macAddress?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;
}
