import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { BillingService } from '../billing/billing.service';

@Injectable()
export class TimerService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private billingService: BillingService,
  ) {}

  async startSession(createSessionDto: CreateSessionDto) {
    const session = this.sessionRepository.create({
      ...createSessionDto,
      startTime: new Date(),
      status: 'running',
    });
    return this.sessionRepository.save(session);
  }

  async stopSession(id: string) {
    const session = await this.findSession(id);
    session.endTime = new Date();
    session.status = 'completed';
    const duration = Math.round(
      (session.endTime.getTime() - session.startTime.getTime()) / 60000,
    );
    session.duration = duration;

    const bill = await this.billingService.calculateBill({
      computerId: session.computerId,
      duration,
      customerId: session.customerId,
    });

    session.billId = bill.id;
    return this.sessionRepository.save(session);
  }

  async pauseSession(id: string) {
    const session = await this.findSession(id);
    session.status = 'paused';
    session.pausedAt = new Date();
    return this.sessionRepository.save(session);
  }

  async resumeSession(id: string) {
    const session = await this.findSession(id);
    if (session.pausedAt) {
      const pausedDuration = Math.round(
        (new Date().getTime() - session.pausedAt.getTime()) / 60000,
      );
      session.totalPausedTime = (session.totalPausedTime || 0) + pausedDuration;
    }
    session.status = 'running';
    session.pausedAt = null;
    return this.sessionRepository.save(session);
  }

  async findSession(id: string) {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async findByComputerId(computerId: string) {
    return this.sessionRepository.find({
      where: { computerId, status: 'running' },
    });
  }

  async findAll() {
    return this.sessionRepository.find();
  }
}
