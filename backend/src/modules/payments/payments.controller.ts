import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @HttpCode(201)
  processPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.processPayment(createPaymentDto);
  }

  @Get(':id')
  getPayment(@Param('id') id: string) {
    return this.paymentsService.findPayment(id);
  }

  @Get()
  getAllPayments() {
    return this.paymentsService.findAll();
  }

  @Get('customer/:customerId')
  getCustomerPayments(@Param('customerId') customerId: string) {
    return this.paymentsService.findByCustomerId(customerId);
  }
}
