import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('daily')
  getDailyReport(@Query('date') date: string) {
    return this.reportsService.getDailyReport(new Date(date));
  }

  @Get('weekly')
  getWeeklyReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getWeeklyReport(new Date(startDate), new Date(endDate));
  }

  @Get('monthly')
  getMonthlyReport(@Query('year') year: string, @Query('month') month: string) {
    return this.reportsService.getMonthlyReport(parseInt(year), parseInt(month));
  }

  @Get('customers')
  getCustomerReport() {
    return this.reportsService.getCustomerReport();
  }

  @Get('top-customers')
  getTopCustomers(@Query('limit') limit: string = '10') {
    return this.reportsService.getTopCustomers(parseInt(limit));
  }
}
