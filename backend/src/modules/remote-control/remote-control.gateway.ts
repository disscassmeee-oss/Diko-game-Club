import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RemoteControlService } from './remote-control.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RemoteControlGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private computerConnections: Map<string, string> = new Map();

  constructor(private remoteControlService: RemoteControlService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('connected', { message: 'Connected to server' });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove computer from map
    for (const [computerId, socketId] of this.computerConnections.entries()) {
      if (socketId === client.id) {
        this.computerConnections.delete(computerId);
      }
    }
  }

  @SubscribeMessage('register:computer')
  handleComputerRegister(client: Socket, data: { computerId: string }) {
    this.computerConnections.set(data.computerId, client.id);
    console.log(`Computer ${data.computerId} registered`);
  }

  @SubscribeMessage('shutdown')
  async handleShutdown(client: Socket, data: { computerId: string; targetIp: string }) {
    const result = await this.remoteControlService.sendCommand(
      data.computerId,
      'shutdown',
      data.targetIp,
    );
    this.server.emit('command:executed', result);
  }

  @SubscribeMessage('restart')
  async handleRestart(client: Socket, data: { computerId: string; targetIp: string }) {
    const result = await this.remoteControlService.sendCommand(
      data.computerId,
      'restart',
      data.targetIp,
    );
    this.server.emit('command:executed', result);
  }

  @SubscribeMessage('lock')
  async handleLock(client: Socket, data: { computerId: string; targetIp: string }) {
    const result = await this.remoteControlService.sendCommand(
      data.computerId,
      'lock',
      data.targetIp,
    );
    this.server.emit('command:executed', result);
  }

  @SubscribeMessage('unlock')
  async handleUnlock(client: Socket, data: { computerId: string; targetIp: string }) {
    const result = await this.remoteControlService.sendCommand(
      data.computerId,
      'unlock',
      data.targetIp,
    );
    this.server.emit('command:executed', result);
  }

  @SubscribeMessage('wol')
  async handleWakeOnLan(client: Socket, data: { macAddress: string }) {
    await this.remoteControlService.sendWakeOnLan(data.macAddress);
    this.server.emit('wol:sent', { status: 'ok', macAddress: data.macAddress });
  }

  broadcastToComputer(computerId: string, event: string, data: any) {
    const socketId = this.computerConnections.get(computerId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }
}
