import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/chat/chat.service';
import { JwtService } from '@nestjs/jwt';

export class JoinConversationDto {
  conversationId!: string;
}

export class SendMessageDto {
  conversationId!: string;
  content!: string;
  type?: 'text' | 'media';
}

export class TypingDto {
  conversationId!: string;
  isTyping!: boolean;
}

export class ReadDto {
  conversationId!: string;
  messageId!: string;
}

@WebSocketGateway({ namespace: '/ws/chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.split(' ')[1];
      if (!token) throw new Error('No token provided');
      
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      client.data.userId = payload.sub;
      console.log(`Client connected: ${client.id}, User: ${client.data.userId}`);
    } catch (err) {
      console.log(`Unauthorized client disconnected: ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  async handleJoin(client: Socket, { conversationId }: JoinConversationDto) {
    // await this.chatService.assertParticipant(client.data.userId, conversationId);
    client.join(`conversation:${conversationId}`);
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, dto: SendMessageDto) {
    // const message = await this.chatService.saveMessage(client.data.userId, dto);
    const message = { id: 'mock-id', ...dto, senderId: client.data.userId };
    this.server.to(`conversation:${dto.conversationId}`).emit('new_message', message);
  }

  @SubscribeMessage('typing')
  async handleTyping(client: Socket, { conversationId, isTyping }: TypingDto) {
    // await this.presenceService.setTyping(client.data.userId, conversationId, isTyping);
    client.to(`conversation:${conversationId}`).emit('typing_indicator', {
      userId: client.data.userId,
      isTyping,
    });
  }

  @SubscribeMessage('mark_read')
  async handleRead(client: Socket, { conversationId, messageId }: ReadDto) {
    // await this.chatService.markRead(client.data.userId, conversationId, messageId);
    client.to(`conversation:${conversationId}`).emit('read_receipt', {
      userId: client.data.userId, 
      messageId, 
      readAt: new Date()
    });
  }
}
