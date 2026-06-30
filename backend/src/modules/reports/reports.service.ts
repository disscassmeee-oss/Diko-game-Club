import { Injectable } from '@nestjs/common';
import { BillingService } from '../billing/billing.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class ReportsService {
  constructor(
    private billingService: BillingService,
    private customersService: CustomersService,
  ) {}

  async getDailyReport(date: Date) {
    const revenue = await this.billingService.getDailyRevenue(date);
    const bills = await this.billingService.findAll();
    const dailyBills = bills.filter(
      (bill) =>
        new Date(bill.createdAt).toDateString() === new Date(date).toDateString() &&
        bill.status === 'paid',
    );

    return {
      date: new Date(date).toDateString(),
      totalRevenue: revenue,
      totalBills: dailyBills.length,
      averageBill: dailyBills.length > 0 ? revenue / dailyBills.length : 0,
    };
  }

  async getWeeklyReport(startDate: Date, endDate: Date) {
    const bills = await this.billingService.findAll();
    const weeklyBills = bills.filter(
      (bill) =>
        new Date(bill.createdAt) >= new Date(startDate) &&
        new Date(bill.createdAt) <= new Date(endDate) &&
        bill.status === 'paid',
    );

    const totalRevenue = weeklyBills.reduce(
      (sum, bill) => sum + parseFloat(bill.amount.toString()),
      0,
    );

    return {
      startDate,
      endDate,
      totalRevenue,
      totalBills: weeklyBills.length,
      averageBill: weeklyBills.length > 0 ? totalRevenue / weeklyBills.length : 0,
    };
  }

  async getMonthlyReport(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const bills = await this.billingService.findAll();
    const monthlyBills = bills.filter(
      (bill) =>
        new Date(bill.createdAt) >= startDate &&
        new Date(bill.createdAt) <= endDate &&
        bill.status === 'paid',
    );

    const totalRevenue = monthlyBills.reduce(
      (sum, bill) => sum + parseFloat(bill.amount.toString()),
      0,
    );

    return {
      year,
      month,
      totalRevenue,
      totalBills: monthlyBills.length,
      averageBill: monthlyBills.length > 0 ? totalRevenue / monthlyBills.length : 0,
    };
  }

  async getCustomerReport() {
    const customers = await this.customersService.findAll();
    const totalCustomers = customers.length;
    const vipCustomers = customers.filter((c) => c.isVip).length;
    const totalBalance = customers.reduce(
      (sum, c) => sum + parseFloat(c.balance.toString()),
      0,
    );

    return {
      totalCustomers,
      vipCustomers,
      regularCustomers: totalCustomers - vipCustomers,
      totalBalance,
    };
  }

  async getTopCustomers(limit: number = 10) {
    const customers = await this.customersService.findAll();
    return customers
      .sort((a, b) => parseFloat(b.balance.toString()) - parseFloat(a.balance.toString()))
      .slice(0, limit);
  }
}
