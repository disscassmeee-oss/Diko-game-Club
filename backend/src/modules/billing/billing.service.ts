import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bill } from './entities/bill.entity';
import { ComputersService } from '../computers/computers.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,
    private computersService: ComputersService,
  ) {}

  async calculateBill(data: {
    computerId: string;
    duration: number;
    customerId?: string;
  }) {
    const computer = await this.computersService.findById(data.computerId);
    const amount = (computer.hourlyRate * data.duration) / 60;

    const bill = this.billRepository.create({
      computerId: data.computerId,
      customerId: data.customerId,
      duration: data.duration,
      hourlyRate: computer.hourlyRate,
      amount,
      status: 'pending',
    });

    return this.billRepository.save(bill);
  }

  async findBill(id: string) {
    const bill = await this.billRepository.findOne({ where: { id } });
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }
    return bill;
  }

  async findAll() {
    return this.billRepository.find();
  }

  async findByCustomerId(customerId: string) {
    return this.billRepository.find({ where: { customerId } });
  }

  async markAsPaid(id: string, paymentMethod: string) {
    await this.billRepository.update(id, {
      status: 'paid',
      paymentMethod,
      paidAt: new Date(),
    });
    return this.findBill(id);
  }

  async getDailyRevenue(date: Date) {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const bills = await this.billRepository
      .createQueryBuilder('bill')
      .where('bill.createdAt BETWEEN :start AND :end', {
        start: startOfDay,
        end: endOfDay,
      })
      .andWhere('bill.status = :status', { status: 'paid' })
      .getMany();

    return bills.reduce((total, bill) => total + parseFloat(bill.amount.toString()), 0);
  }
}
