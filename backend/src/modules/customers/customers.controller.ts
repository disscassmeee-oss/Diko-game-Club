import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Post(':id/balance/add')
  @HttpCode(200)
  addBalance(@Param('id') id: string, @Body() body: { amount: number }) {
    return this.customersService.addBalance(id, body.amount);
  }

  @Post(':id/balance/deduct')
  @HttpCode(200)
  deductBalance(@Param('id') id: string, @Body() body: { amount: number }) {
    return this.customersService.deductBalance(id, body.amount);
  }

  @Post(':id/bonus/add')
  @HttpCode(200)
  addBonus(@Param('id') id: string, @Body() body: { points: number }) {
    return this.customersService.addBonus(id, body.points);
  }

  @Post(':id/bonus/redeem')
  @HttpCode(200)
  redeemBonus(@Param('id') id: string, @Body() body: { points: number }) {
    return this.customersService.redeemBonus(id, body.points);
  }
}
