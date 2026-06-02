import { Module } from '@nestjs/common';
import { ChatService } from './services/chat/chat.service';
import { ChatGateway } from './gateways/chat.gateway';
import { ChatController } from './controllers/chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway]
})
export class ChatModule {}
