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
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll() {
    return this.reservationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findById(id);
  }

  @Get('computer/:computerId')
  findByComputer(@Param('computerId') computerId: string) {
    return this.reservationService.findByComputerId(computerId);
  }

  @Get('customer/:customerId')
  findByCustomer(@Param('customerId') customerId: string) {
    return this.reservationService.findByCustomerId(customerId);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.reservationService.cancel(id);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.reservationService.confirm(id);
  }
}
