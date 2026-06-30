import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private customersService: CustomersService,
  ) {}

  async processPayment(createPaymentDto: CreatePaymentDto) {
    const customer = await this.customersService.findById(createPaymentDto.customerId);

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      status: 'pending',
      transactionId: this.generateTransactionId(),
    });

    const savedPayment = await this.paymentRepository.save(payment);

    try {
      let externalTransactionId;

      if (createPaymentDto.paymentMethod === 'click') {
        externalTransactionId = await this.processClickPayment(createPaymentDto.amount);
      } else if (createPaymentDto.paymentMethod === 'payme') {
        externalTransactionId = await this.processPaymePayment(createPaymentDto.amount);
      } else if (createPaymentDto.paymentMethod === 'uzum') {
        externalTransactionId = await this.processUzumPayment(createPaymentDto.amount);
      } else if (createPaymentDto.paymentMethod === 'cash') {
        externalTransactionId = 'CASH_' + Date.now();
      }

      await this.paymentRepository.update(savedPayment.id, {
        externalTransactionId,
        status: 'completed',
        completedAt: new Date(),
      });

      await this.customersService.addBalance(createPaymentDto.customerId, createPaymentDto.amount);

      return this.findPayment(savedPayment.id);
    } catch (error) {
      await this.paymentRepository.update(savedPayment.id, { status: 'failed' });
      throw new BadRequestException('Payment processing failed: ' + error.message);
    }
  }

  private async processClickPayment(amount: number): Promise<string> {
    // Integrate with Click payment gateway
    console.log(`Processing Click payment: ${amount}`);
    return 'CLICK_' + Date.now();
  }

  private async processPaymePayment(amount: number): Promise<string> {
    // Integrate with Payme payment gateway
    console.log(`Processing Payme payment: ${amount}`);
    return 'PAYME_' + Date.now();
  }

  private async processUzumPayment(amount: number): Promise<string> {
    // Integrate with Uzum payment gateway
    console.log(`Processing Uzum payment: ${amount}`);
    return 'UZUM_' + Date.now();
  }

  private generateTransactionId(): string {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async findPayment(id: string) {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  async findByCustomerId(customerId: string) {
    return this.paymentRepository.find({ where: { customerId } });
  }
}
