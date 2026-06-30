import { IsString, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsString()
  computerId: string;

  @IsOptional()
  @IsString()
  customerId?: string;
}
