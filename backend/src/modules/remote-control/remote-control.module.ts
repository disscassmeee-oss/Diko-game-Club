import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemoteControlService } from './remote-control.service';
import { RemoteControlGateway } from './remote-control.gateway';
import { RemoteCommand } from './entities/remote-command.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RemoteCommand])],
  providers: [RemoteControlService, RemoteControlGateway],
  exports: [RemoteControlService],
})
export class RemoteControlModule {}
