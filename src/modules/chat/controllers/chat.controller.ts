import { Controller, Post, Get, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ChatService } from '../services/chat/chat.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

class CreateConversationDto {
  type!: 'direct' | 'group';
  participantIds!: string[];
}

@ApiTags('Conversations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('api/v1/conversations')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new DM or group conversation' })
  async createConversation(@Req() req: any, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "List user's conversations" })
  async listConversations(@Req() req: any) {
    return this.chatService.listConversations(req.user.id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get paginated message history using cursor' })
  @ApiQuery({ name: 'cursor', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMessages(
    @Req() req: any, 
    @Param('id') conversationId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = 50
  ) {
    return this.chatService.getMessages(req.user.id, conversationId, cursor, Number(limit));
  }
}