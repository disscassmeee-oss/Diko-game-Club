import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RemoteCommand } from './entities/remote-command.entity';
import * as os from 'os';
import * as dgram from 'dgram';

@Injectable()
export class RemoteControlService {
  constructor(
    @InjectRepository(RemoteCommand)
    private remoteCommandRepository: Repository<RemoteCommand>,
  ) {}

  async sendCommand(computerId: string, command: string, targetIp: string) {
    const remoteCommand = this.remoteCommandRepository.create({
      computerId,
      command,
      targetIp,
      status: 'pending',
    });

    const saved = await this.remoteCommandRepository.save(remoteCommand);

    try {
      switch (command) {
        case 'shutdown':
          await this.executeShutdown(targetIp);
          break;
        case 'restart':
          await this.executeRestart(targetIp);
          break;
        case 'lock':
          await this.executeLock(targetIp);
          break;
        case 'unlock':
          await this.executeUnlock(targetIp);
          break;
        case 'sleep':
          await this.executeSleep(targetIp);
          break;
      }

      await this.remoteCommandRepository.update(saved.id, {
        status: 'completed',
        completedAt: new Date(),
      });
    } catch (error) {
      await this.remoteCommandRepository.update(saved.id, {
        status: 'failed',
        errorMessage: error.message,
      });
    }

    return this.findCommand(saved.id);
  }

  private async executeShutdown(targetIp: string) {
    console.log(`Sending shutdown command to ${targetIp}`);
    // Will be handled by client agent
  }

  private async executeRestart(targetIp: string) {
    console.log(`Sending restart command to ${targetIp}`);
    // Will be handled by client agent
  }

  private async executeLock(targetIp: string) {
    console.log(`Sending lock command to ${targetIp}`);
    // Will be handled by client agent
  }

  private async executeUnlock(targetIp: string) {
    console.log(`Sending unlock command to ${targetIp}`);
    // Will be handled by client agent
  }

  private async executeSleep(targetIp: string) {
    console.log(`Sending sleep command to ${targetIp}`);
    // Will be handled by client agent
  }

  async sendWakeOnLan(macAddress: string) {
    const broadcast = '255.255.255.255';
    const port = 9;

    const mac = macAddress.split(':').map((x) => parseInt(x, 16));
    const packet = Buffer.alloc(102);

    // Fill first 6 bytes with 0xff
    for (let i = 0; i < 6; i++) {
      packet[i] = 0xff;
    }

    // Fill rest with mac address repeated 16 times
    for (let i = 1; i <= 16; i++) {
      for (let j = 0; j < 6; j++) {
        packet[i * 6 + j] = mac[j];
      }
    }

    const client = dgram.createSocket('udp4');
    client.setBroadcast(true);
    client.send(packet, 0, packet.length, port, broadcast, (err) => {
      if (err) console.error('WOL Error:', err);
      client.close();
    });
  }

  async findCommand(id: string) {
    const command = await this.remoteCommandRepository.findOne({ where: { id } });
    if (!command) {
      throw new NotFoundException('Command not found');
    }
    return command;
  }

  async findAll() {
    return this.remoteCommandRepository.find();
  }

  async findByComputerId(computerId: string) {
    return this.remoteCommandRepository.find({ where: { computerId } });
  }
}
