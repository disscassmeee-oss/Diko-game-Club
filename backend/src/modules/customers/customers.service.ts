import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findAll() {
    return this.customerRepository.find();
  }

  async findById(id: string) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async findByPhone(phone: string) {
    return this.customerRepository.findOne({ where: { phone } });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.customerRepository.update(id, updateCustomerDto);
    return this.findById(id);
  }

  async addBalance(id: string, amount: number) {
    const customer = await this.findById(id);
    const newBalance = parseFloat(customer.balance.toString()) + amount;
    await this.customerRepository.update(id, { balance: newBalance });
    return this.findById(id);
  }

  async deductBalance(id: string, amount: number) {
    const customer = await this.findById(id);
    const newBalance = parseFloat(customer.balance.toString()) - amount;
    if (newBalance < 0) {
      throw new Error('Insufficient balance');
    }
    await this.customerRepository.update(id, { balance: newBalance });
    return this.findById(id);
  }

  async addBonus(id: string, points: number) {
    const customer = await this.findById(id);
    const newBonus = customer.bonusPoints + points;
    await this.customerRepository.update(id, { bonusPoints: newBonus });
    return this.findById(id);
  }

  async redeemBonus(id: string, points: number) {
    const customer = await this.findById(id);
    if (customer.bonusPoints < points) {
      throw new Error('Insufficient bonus points');
    }
    const newBonus = customer.bonusPoints - points;
    await this.customerRepository.update(id, { bonusPoints: newBonus });
    return this.findById(id);
  }
}
