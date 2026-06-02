import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../../../database/database.module';
import { UPSTASH_REDIS } from '../../../infrastructure/cache/redis.module';
import { users } from '../../../database/schema/auth/users';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../database/schema';

@Injectable()
export class PresenceService {
  private readonly TTL = 35; // seconds — slightly more than heartbeat interval

  constructor(
    @Inject(UPSTASH_REDIS) private readonly redis: any,
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
  ) {}

  async setOnline(userId: string, socketId: string) {
    const payload = JSON.stringify({
      status: 'online', 
      socketId, 
      lastSeen: new Date().toISOString()
    });

    // Check if using upstash or ioredis to support both set methods
    if (this.redis.setex) {
      await this.redis.setex(`presence:${userId}`, this.TTL, payload);
    } else {
      await this.redis.set(`presence:${userId}`, payload, { ex: this.TTL });
    }

    await this.db.update(users)
      .set({ lastSeenAt: new Date() })
      .where(eq(users.id, userId));
  }

  async setOffline(userId: string) {
    await this.redis.del(`presence:${userId}`);
    await this.db.update(users)
      .set({ lastSeenAt: new Date() })
      .where(eq(users.id, userId));
  }

  async isOnline(userId: string): Promise<boolean> {
    return !!(await this.redis.exists(`presence:${userId}`));
  }

  async notifyFollowers(userId: string, status: 'online' | 'offline') {
    // Logic to fetch followers and broadcast presence status via WebSocket/Gateway or internal PubSub
    // This will be implemented fully once Follow schema/queries are finalized
  }
  
  async setTyping(userId: string, conversationId: string, isTyping: boolean) {
    const key = `typing:${conversationId}:${userId}`;
    if (isTyping) {
      if (this.redis.setex) {
        await this.redis.setex(key, 8, '1');
      } else {
        await this.redis.set(key, '1', { ex: 8 });
      }
    } else {
      await this.redis.del(key);
    }
  }
}