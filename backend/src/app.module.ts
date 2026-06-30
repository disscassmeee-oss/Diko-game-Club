import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from './modules/settings/settings.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { RemoteControlModule } from './modules/remote-control/remote-control.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ComputersModule } from './modules/computers/computers.module';
import { TimerModule } from './modules/timer/timer.module';
import { BillingModule } from './modules/billing/billing.module';
import { FoodModule } from './modules/food/food.module';
import { CustomersModule } from './modules/customers/customers.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReportsModule } from './modules/reports/reports.module';
import { TournamentModule } from './modules/tournament/tournament.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { User } from './modules/users/entities/user.entity';
import { Computer } from './modules/computers/entities/computer.entity';
import { Session } from './modules/timer/entities/session.entity';
import { Bill } from './modules/billing/entities/bill.entity';
import { FoodMenu } from './modules/food/entities/food-menu.entity';
import { Order } from './modules/food/entities/order.entity';
import { OrderItem } from './modules/food/entities/order-item.entity';
import { Customer } from './modules/customers/entities/customer.entity';
import { Payment } from './modules/payments/entities/payment.entity';
import { Tournament } from './modules/tournament/entities/tournament.entity';
import { TournamentParticipant } from './modules/tournament/entities/tournament-participant.entity';
import { Reservation } from './modules/reservation/entities/reservation.entity';
import { RemoteCommand } from './modules/remote-control/entities/remote-command.entity';
import { Settings } from './modules/settings/entities/settings.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'admin123',
      database: process.env.DB_NAME || 'diko_cafe',
      entities: [
        User,
        Computer,
        Session,
        Bill,
        FoodMenu,
        Order,
        OrderItem,
        Customer,
        Payment,
        Tournament,
        TournamentParticipant,
        Reservation,
        RemoteCommand,
        Settings,
      ],
      synchronize: true,
      logging: true,
    }),
    AuthModule,
    UsersModule,
    ComputersModule,
    TimerModule,
    BillingModule,
    FoodModule,
    CustomersModule,
    PaymentsModule,
    ReportsModule,
    TournamentModule,
    ReservationModule,
    RemoteControlModule,
    NotificationsModule,
    SettingsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
