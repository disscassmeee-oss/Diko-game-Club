import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { TimerGateway } from './timer.gateway';
import { Session } from './entities/session.entity';
import { ComputersModule } from '../computers/computers.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session]),
    ComputersModule,
    BillingModule,
  ],
  providers: [TimerService, TimerGateway],
  controllers: [TimerController],
  exports: [TimerService],
})
export class TimerModule {}
