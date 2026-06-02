import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: '/ws/notifications', cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) throw new Error('No token provided');

      const payload = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      client.data.userId = payload.sub;
      console.log(`Notification client connected: ${client.id}, User: ${client.data.userId}`);
      
      // Join a personal room using their user ID so workers can broadcast to them
      client.join(`user:${client.data.userId}`);
    } catch (err) {
      console.log(`Unauthorized notification client disconnected: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Notification client disconnected: ${client.id}`);
  }
}
