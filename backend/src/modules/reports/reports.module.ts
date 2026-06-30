import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { BillingModule } from '../billing/billing.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [BillingModule, CustomersModule],
  providers: [ReportsService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
