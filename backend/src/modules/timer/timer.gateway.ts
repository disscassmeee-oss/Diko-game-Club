import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { TimerService } from './timer.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TimerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private timerService: TimerService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('session:start')
  async handleStartSession(client: Socket, data: any) {
    const session = await this.timerService.startSession(data);
    this.server.emit('session:started', session);
    return session;
  }

  @SubscribeMessage('session:stop')
  async handleStopSession(client: Socket, data: any) {
    const session = await this.timerService.stopSession(data.id);
    this.server.emit('session:stopped', session);
    return session;
  }

  @SubscribeMessage('session:pause')
  async handlePauseSession(client: Socket, data: any) {
    const session = await this.timerService.pauseSession(data.id);
    this.server.emit('session:paused', session);
    return session;
  }

  @SubscribeMessage('session:resume')
  async handleResumeSession(client: Socket, data: any) {
    const session = await this.timerService.resumeSession(data.id);
    this.server.emit('session:resumed', session);
    return session;
  }

  @SubscribeMessage('session:status')
  async handleSessionStatus(client: Socket, data: any) {
    const session = await this.timerService.findSession(data.id);
    client.emit('session:status', session);
    return session;
  }
}
