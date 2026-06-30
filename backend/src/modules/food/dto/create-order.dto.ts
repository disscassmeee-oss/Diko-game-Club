import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  computerId?: string;

  @IsArray()
  items: Array<{ foodMenuId: string; quantity: number }>;
}
