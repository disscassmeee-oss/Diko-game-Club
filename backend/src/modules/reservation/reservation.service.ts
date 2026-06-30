import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const existingReservation = await this.reservationRepository.findOne({
      where: {
        computerId: createReservationDto.computerId,
        reservedAt: createReservationDto.reservedAt,
      },
    });

    if (existingReservation) {
      throw new BadRequestException('Computer already reserved for this time');
    }

    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      status: 'confirmed',
    });

    return this.reservationRepository.save(reservation);
  }

  async findAll() {
    return this.reservationRepository.find();
  }

  async findById(id: string) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }
    return reservation;
  }

  async findByComputerId(computerId: string) {
    return this.reservationRepository.find({ where: { computerId } });
  }

  async findByCustomerId(customerId: string) {
    return this.reservationRepository.find({ where: { customerId } });
  }

  async cancel(id: string) {
    const reservation = await this.findById(id);
    if (reservation.status === 'cancelled') {
      throw new BadRequestException('Already cancelled');
    }
    await this.reservationRepository.update(id, { status: 'cancelled' });
    return this.findById(id);
  }

  async confirm(id: string) {
    await this.reservationRepository.update(id, { status: 'confirmed' });
    return this.findById(id);
  }
}
