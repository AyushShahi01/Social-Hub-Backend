import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PresenceService } from '../services/presence.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: '/ws/presence', cors: true })
export class PresenceGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly presenceService: PresenceService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) throw new Error('No token provided');

      const payload = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      const userId = payload.sub;
      client.data.userId = userId;
      console.log(`Presence client connected: ${client.id}, User: ${userId}`);
      
      await this.presenceService.setOnline(userId, client.id);
      client.join(`user:${userId}`);
      
      // Broadcast to followers
      await this.presenceService.notifyFollowers(userId, 'online');
    } catch (err) {
      console.log(`Unauthorized presence client disconnected: ${client.id}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Presence client disconnected: ${client.id}`);
    const userId = client.data.userId;
    
    await this.presenceService.setOffline(userId);
    await this.presenceService.notifyFollowers(userId, 'offline');
  }
}