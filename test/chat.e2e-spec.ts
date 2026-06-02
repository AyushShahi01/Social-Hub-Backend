import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket } from 'socket.io-client';
import { ChatGateway } from '../src/modules/chat/gateways/chat.gateway';
import { ChatService } from '../src/modules/chat/services/chat/chat.service';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { DRIZZLE } from '../src/database/database.module';

describe('ChatGateway (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let port: number;

  beforeAll(async () => {
    // Set a test JWT secret
    process.env.JWT_ACCESS_SECRET = 'test-secret-key-12345';

    const mockDb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(null),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: process.env.JWT_ACCESS_SECRET,
        }),
      ],
      providers: [
        ChatGateway,
        ChatService,
        {
          provide: DRIZZLE,
          useValue: mockDb,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.listen(0); // Listen on dynamic port
    const address = app.getHttpServer().address();
    port = typeof address === 'string' ? 0 : address.port;

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should reject unauthorized socket connections', (done) => {
    const socket = io(`http://localhost:${port}/ws/chat`, {
      transports: ['websocket'],
      auth: { token: 'invalid-token' },
    });

    socket.on('connect_error', () => {
      socket.close();
      done();
    });

    socket.on('disconnect', () => {
      socket.close();
      done();
    });

    // Timeout fallback if disconnection doesn't happen
    setTimeout(() => {
      if (socket.connected) {
        socket.close();
        done(new Error('Socket should have been disconnected'));
      } else {
        done();
      }
    }, 1000);
  });

  it('should authenticate successfully and broadcast messages in a conversation room', (done) => {
    const userId = 'user-123';
    const conversationId = 'conv-456';
    const token = jwtService.sign({ sub: userId });

    const clientSocket = io(`http://localhost:${port}/ws/chat`, {
      transports: ['websocket'],
      auth: { token },
    });

    clientSocket.on('connect', () => {
      // Join the conversation room
      clientSocket.emit('join_conversation', { conversationId });

      // After joining, emit a test message
      setTimeout(() => {
        clientSocket.emit('send_message', {
          conversationId,
          content: 'Hello, World!',
          type: 'text',
        });
      }, 100);
    });

    clientSocket.on('new_message', (message) => {
      expect(message).toBeDefined();
      expect(message.content).toBe('Hello, World!');
      expect(message.conversationId).toBe(conversationId);
      expect(message.senderId).toBe(userId);
      expect(message.id).toBe('mock-id');

      clientSocket.close();
      done();
    });

    clientSocket.on('connect_error', (err) => {
      clientSocket.close();
      done(err);
    });
  });

  it('should broadcast typing indicator to other clients in the conversation', (done) => {
    const userId1 = 'user-1';
    const userId2 = 'user-2';
    const conversationId = 'conv-456';
    const token1 = jwtService.sign({ sub: userId1 });
    const token2 = jwtService.sign({ sub: userId2 });

    const client1 = io(`http://localhost:${port}/ws/chat`, {
      transports: ['websocket'],
      auth: { token: token1 },
    });

    const client2 = io(`http://localhost:${port}/ws/chat`, {
      transports: ['websocket'],
      auth: { token: token2 },
    });

    let connections = 0;
    const onConnect = () => {
      connections++;
      if (connections === 2) {
        // Both connected, join conversation
        client1.emit('join_conversation', { conversationId });
        client2.emit('join_conversation', { conversationId });

        // Trigger typing from client 1
        setTimeout(() => {
          client1.emit('typing', { conversationId, isTyping: true });
        }, 150);
      }
    };

    client1.on('connect', onConnect);
    client2.on('connect', onConnect);

    // Client 2 should receive typing indicator from Client 1
    client2.on('typing_indicator', (data) => {
      expect(data.userId).toBe(userId1);
      expect(data.isTyping).toBe(true);

      client1.close();
      client2.close();
      done();
    });
  });
});
