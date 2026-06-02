import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../../../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../../database/schema';
import { eq, and } from 'drizzle-orm';
import { participants } from '../../../../database/schema/chat/chat.schema';

@Injectable()
export class ChatService {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async markRead(userId: string, conversationId: string, messageId: string) {
    await this.db.update(participants)
      .set({ lastReadMessageId: messageId })
      .where(
        and(
          eq(participants.conversationId, conversationId),
          eq(participants.userId, userId)
        )
      );
  }

  async createConversation(userId: string, dto: any) {
    // Logic to create a new DM or group, and add participant rows
    return { id: 'mock-conv-id', type: dto.type, participants: [userId, ...dto.participantIds] };
  }

  async listConversations(userId: string) {
    // Logic to join `participants` and `conversations` to list active chats for user
    return [];
  }

  async getMessages(userId: string, conversationId: string, cursor?: string, limit = 50) {
    // Drizzle query using cursor (where messages.id / createdAt < cursor) to fetch history
    return { messages: [], nextCursor: null };
  }
}
