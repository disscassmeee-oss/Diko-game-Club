import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateTournamentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  game: string;

  @IsOptional()
  @IsNumber()
  entryFee?: number;

  @IsOptional()
  @IsNumber()
  prizePool?: number;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}
