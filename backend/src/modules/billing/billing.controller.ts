import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get(':id')
  getBill(@Param('id') id: string) {
    return this.billingService.findBill(id);
  }

  @Get()
  getAllBills() {
    return this.billingService.findAll();
  }

  @Get('customer/:customerId')
  getCustomerBills(@Param('customerId') customerId: string) {
    return this.billingService.findByCustomerId(customerId);
  }

  @Post(':id/pay')
  @HttpCode(200)
  markAsPaid(
    @Param('id') id: string,
    @Body() body: { paymentMethod: string },
  ) {
    return this.billingService.markAsPaid(id, body.paymentMethod);
  }

  @Get('revenue/daily')
  getDailyRevenue(@Query('date') date: string) {
    return this.billingService.getDailyRevenue(new Date(date));
  }
}
