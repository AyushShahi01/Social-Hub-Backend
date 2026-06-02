import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from '../services/chat/chat.service';

describe('ChatController', () => {
  let controller: ChatController;
  let service: ChatService;

  const mockChatService = {
    createConversation: jest.fn().mockImplementation((userId, dto) => Promise.resolve({ id: 'mock-conv-id', type: dto.type, participants: [userId, ...dto.participantIds] })),
    listConversations: jest.fn().mockImplementation((userId) => Promise.resolve([])),
    getMessages: jest.fn().mockImplementation((userId, conversationId, cursor, limit) => Promise.resolve({ messages: [], nextCursor: null })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create conversation', async () => {
    const dto = { type: 'direct' as const, participantIds: ['user-2'] };
    const req = { user: { id: 'user-1' } };
    const res = await controller.createConversation(req, dto);
    expect(res).toBeDefined();
    expect(res.id).toBe('mock-conv-id');
    expect(service.createConversation).toHaveBeenCalledWith('user-1', dto);
  });

  it('should list conversations', async () => {
    const req = { user: { id: 'user-1' } };
    const res = await controller.listConversations(req);
    expect(res).toEqual([]);
    expect(service.listConversations).toHaveBeenCalledWith('user-1');
  });

  it('should get messages', async () => {
    const req = { user: { id: 'user-1' } };
    const res = await controller.getMessages(req, 'conv-123', 'cursor-abc', 20);
    expect(res).toEqual({ messages: [], nextCursor: null });
    expect(service.getMessages).toHaveBeenCalledWith('user-1', 'conv-123', 'cursor-abc', 20);
  });
});
