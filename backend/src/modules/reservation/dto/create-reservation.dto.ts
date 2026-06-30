import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  customerId: string;

  @IsString()
  computerId: string;

  @IsDate()
  reservedAt: Date;

  @IsNumber()
  durationHours: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
