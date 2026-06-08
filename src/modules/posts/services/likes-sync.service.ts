import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UPSTASH_REDIS } from '../../../infrastructure/cache/redis.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DRIZZLE } from '../../../database/database.module';
import * as schema from '../../../database/schema/index';
import { and, eq, inArray } from 'drizzle-orm';

@Injectable()
export class LikesSyncService implements OnModuleInit {
  private readonly logger = new Logger(LikesSyncService.name);

  constructor(
    @Inject(UPSTASH_REDIS) private readonly redis: any,
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  onModuleInit() {
    this.logger.log('LikesSyncService initialized.');
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async syncLikes() {
    this.logger.log('Starting 5-minute likes synchronization...');
    try {
      await this.syncPostLikes();
      await this.syncCommentLikes();
      this.logger.log('Likes synchronization completed successfully.');
    } catch (error) {
      this.logger.error('Failed to synchronize likes:', error);
    }
  }

  private async syncPostLikes() {
    // 1. Get all dirty post IDs from Redis
    const dirtyPostIds: string[] = await this.redis.smembers('likes:dirty:posts');
    if (!dirtyPostIds || dirtyPostIds.length === 0) {
      this.logger.log('No dirty post likes to synchronize.');
      return;
    }

    this.logger.log(`Synchronizing likes for ${dirtyPostIds.length} posts...`);

    for (const postId of dirtyPostIds) {
      // 2. Get current cached user IDs who liked this post
      const cachedUserIds: string[] = await this.redis.smembers(`post:likes:users:${postId}`);

      // 3. Get database user IDs who liked this post
      const dbLikes = await this.db.query.likes.findMany({
        where: and(
          eq(schema.likes.postId, postId),
          eq(schema.likes.targetType, 'POST'),
        ),
        columns: { userId: true },
      });
      const dbUserIds = dbLikes.map((l) => l.userId);

      const cachedSet = new Set(cachedUserIds);
      const dbSet = new Set(dbUserIds);

      // Determine additions (in cache, not in db)
      const toAdd = cachedUserIds.filter((id) => !dbSet.has(id));
      // Determine deletions (in db, not in cache)
      const toDelete = dbUserIds.filter((id) => !cachedSet.has(id));

      // 4. Batch database changes
      if (toAdd.length > 0) {
        const insertValues = toAdd.map((userId) => ({
          userId,
          postId,
          targetType: 'POST' as const,
        }));
        await this.db.insert(schema.likes).values(insertValues).onConflictDoNothing();
      }

      if (toDelete.length > 0) {
        await this.db.delete(schema.likes).where(
          and(
            eq(schema.likes.postId, postId),
            eq(schema.likes.targetType, 'POST'),
            inArray(schema.likes.userId, toDelete),
          ),
        );
      }

      // 5. Update the likeCount in the posts table
      const cachedCountStr = await this.redis.get(`post:likes:count:${postId}`);
      const actualCount = cachedCountStr ? parseInt(cachedCountStr, 10) : cachedUserIds.length;
      await this.db
        .update(schema.posts)
        .set({ likeCount: actualCount })
        .where(eq(schema.posts.id, postId));

      // Remove from dirty set
      await this.redis.srem('likes:dirty:posts', postId);
    }
  }

  private async syncCommentLikes() {
    // 1. Get all dirty comment IDs from Redis
    const dirtyCommentIds: string[] = await this.redis.smembers('likes:dirty:comments');
    if (!dirtyCommentIds || dirtyCommentIds.length === 0) {
      this.logger.log('No dirty comment likes to synchronize.');
      return;
    }

    this.logger.log(`Synchronizing likes for ${dirtyCommentIds.length} comments...`);

    for (const commentId of dirtyCommentIds) {
      // 2. Get current cached user IDs who liked this comment
      const cachedUserIds: string[] = await this.redis.smembers(`comment:likes:users:${commentId}`);

      // 3. Get database user IDs who liked this comment
      const dbLikes = await this.db.query.likes.findMany({
        where: and(
          eq(schema.likes.commentId, commentId),
          eq(schema.likes.targetType, 'COMMENT'),
        ),
        columns: { userId: true },
      });
      const dbUserIds = dbLikes.map((l) => l.userId);

      const cachedSet = new Set(cachedUserIds);
      const dbSet = new Set(dbUserIds);

      // Determine additions (in cache, not in db)
      const toAdd = cachedUserIds.filter((id) => !dbSet.has(id));
      // Determine deletions (in db, not in cache)
      const toDelete = dbUserIds.filter((id) => !cachedSet.has(id));

      // 4. Batch database changes
      if (toAdd.length > 0) {
        const insertValues = toAdd.map((userId) => ({
          userId,
          commentId,
          targetType: 'COMMENT' as const,
        }));
        await this.db.insert(schema.likes).values(insertValues).onConflictDoNothing();
      }

      if (toDelete.length > 0) {
        await this.db.delete(schema.likes).where(
          and(
            eq(schema.likes.commentId, commentId),
            eq(schema.likes.targetType, 'COMMENT'),
            inArray(schema.likes.userId, toDelete),
          ),
        );
      }

      // 5. Update the likeCount in the comments table
      const cachedCountStr = await this.redis.get(`comment:likes:count:${commentId}`);
      const actualCount = cachedCountStr ? parseInt(cachedCountStr, 10) : cachedUserIds.length;
      await this.db
        .update(schema.comments)
        .set({ likeCount: actualCount })
        .where(eq(schema.comments.id, commentId));

      // Remove from dirty set
      await this.redis.srem('likes:dirty:comments', commentId);
    }
  }
}
