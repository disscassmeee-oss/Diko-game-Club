import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComputersService } from './computers.service';
import { ComputersController } from './computers.controller';
import { Computer } from './entities/computer.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Computer]), NotificationsModule],
  providers: [ComputersService],
  controllers: [ComputersController],
  exports: [ComputersService],
})
export class ComputersModule {}
