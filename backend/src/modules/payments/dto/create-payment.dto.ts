import { IsString, IsNumber, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  customerId: string;

  @IsNumber()
  amount: number;

  @IsEnum(['click', 'payme', 'uzum', 'cash'])
  paymentMethod: string;
}
