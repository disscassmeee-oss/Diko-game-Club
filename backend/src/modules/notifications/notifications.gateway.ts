import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('notification:send')
  handleNotification(client: Socket, data: any) {
    this.server.emit('notification', data);
  }

  sendNotification(data: any) {
    this.server.emit('notification', data);
  }

  sendToUser(userId: string, data: any) {
    this.server.emit(`notification:${userId}`, data);
  }
}
