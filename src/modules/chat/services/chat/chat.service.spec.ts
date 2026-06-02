import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { DRIZZLE } from '../../../../database/database.module';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const mockDb = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: DRIZZLE,
          useValue: mockDb,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
