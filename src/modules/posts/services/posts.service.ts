import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { PostsRepository } from '../repositories/posts.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { FeedService } from '../../feed/services/feed.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { GetPostsDto } from '../dto/get-posts.dto';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { UPSTASH_REDIS } from '../../../infrastructure/cache/redis.module';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
    private feedService: FeedService,
    private notificationsService: NotificationsService,
    @Inject(UPSTASH_REDIS) private readonly redis: any,
  ) { }

  // ── Helpers ────────────────────────────────────────────
  private extractHashtags(content: string): string[] {
    const matches = content.match(/#[a-zA-Z0-9_]+/g) ?? [];
    return [
      ...new Set(matches.map((tag: string) => tag.slice(1).toLowerCase())),
    ];
  }

  private extractMentions(content: string): string[] {
    const matches = content.match(/@[a-zA-Z0-9_]+/g) ?? [];
    return [
      ...new Set(
        matches.map((mention: string) => mention.slice(1).toLowerCase()),
      ),
    ];
  }

  private buildPaginatedResponse<T>(
    items: T[],
    limit: number,
    encodeCursor: (item: T) => string,
  ) {
    const hasMore = items.length === limit;
    const nextCursor = hasMore ? encodeCursor(items[items.length - 1]) : null;
    return { data: items, nextCursor, hasMore };
  }

  private async ensurePostLikesCached(postId: string): Promise<void> {
    const isCached = await this.redis.exists(`post:likes:cached:${postId}`);
    if (isCached === 1 || isCached === true) return;

    const dbLikes = await this.postsRepository.getPostLikes(postId, 999999);
    const userIds = dbLikes.map((l: any) => l.userId);
    if (userIds.length > 0) {
      await this.redis.sadd(`post:likes:users:${postId}`, ...userIds);
      await this.redis.expire(`post:likes:users:${postId}`, 86400);
    }
    await this.redis.set(`post:likes:count:${postId}`, userIds.length.toString());
    await this.redis.expire(`post:likes:count:${postId}`, 86400);
    await this.redis.setex(`post:likes:cached:${postId}`, 86400, 'true');
  }

  private async ensureCommentLikesCached(commentId: string): Promise<void> {
    const isCached = await this.redis.exists(`comment:likes:cached:${commentId}`);
    if (isCached === 1 || isCached === true) return;

    const dbLikes = await this.postsRepository.getCommentLikes(commentId);
    const userIds = dbLikes.map((l: any) => l.userId);
    if (userIds.length > 0) {
      await this.redis.sadd(`comment:likes:users:${commentId}`, ...userIds);
      await this.redis.expire(`comment:likes:users:${commentId}`, 86400);
    }
    await this.redis.set(`comment:likes:count:${commentId}`, userIds.length.toString());
    await this.redis.expire(`comment:likes:count:${commentId}`, 86400);
    await this.redis.setex(`comment:likes:cached:${commentId}`, 86400, 'true');
  }

  private async enrichPostWithCachedLikes<T extends { id: string; likeCount: number }>(post: T): Promise<T> {
    const cachedCount = await this.redis.get(`post:likes:count:${post.id}`);
    if (cachedCount !== null) {
      post.likeCount = parseInt(cachedCount, 10);
    }
    return post;
  }

  private async enrichPostsWithCachedLikes<T extends { id: string; likeCount: number }>(posts: T[]): Promise<T[]> {
    await Promise.all(
      posts.map(async (post) => {
        const cachedCount = await this.redis.get(`post:likes:count:${post.id}`);
        if (cachedCount !== null) {
          post.likeCount = parseInt(cachedCount, 10);
        }
      })
    );
    return posts;
  }

  async isLikedCached(userId: string, postId: string): Promise<boolean> {
    await this.ensurePostLikesCached(postId);
    const isMember = await this.redis.sismember(`post:likes:users:${postId}`, userId);
    return isMember === 1 || isMember === true;
  }

  // ── Posts ──────────────────────────────────────────────
  async createPost(userId: string, dto: CreatePostDto) {
    const post = await this.postsRepository.createPost({
      authorId: userId,
      content: dto.content,
      visibility: dto.visibility ?? 'PUBLIC',
    });

    // process hashtags
    const hashtags = this.extractHashtags(dto.content);
    for (const tag of hashtags) {
      const hashtag = await this.postsRepository.upsertHashtag(tag);
      await this.postsRepository.linkHashtagToPost(post.id, hashtag.id);
    }

    // process mentions
    const mentionedUsernames = this.extractMentions(dto.content);
    for (const username of mentionedUsernames) {
      const mentionedUser = await this.usersRepository.findByUsername(username);
      if (mentionedUser) {
        await this.postsRepository.createMention(post.id, mentionedUser.id);
      }
    }

    for (const username of mentionedUsernames) {
      const mentionedUser = await this.usersRepository.findByUsername(username);
      if (mentionedUser) {
        await this.postsRepository.createMention(post.id, mentionedUser.id);
        await this.notificationsService.notifyMention(userId, mentionedUser.id, post.id);
      }
    }
    // fan-out post to followers' inboxes
    await this.feedService.fanOutPost(post.id, userId);

    return post;
  }

  async getPost(postId: string, currentUserId: string) {
    const dbPost = await this.postsRepository.findPostById(postId);
    if (!dbPost) throw new NotFoundException('Post not found');

    const isBlocked = await this.usersRepository.isBlocked(
      dbPost.authorId,
      currentUserId,
    );
    if (isBlocked) throw new NotFoundException('Post not found');

    const post = await this.enrichPostWithCachedLikes(dbPost);

    const [isLiked, isBookmarked] = await Promise.all([
      this.isLikedCached(currentUserId, postId),
      this.postsRepository.isBookmarked(currentUserId, postId),
    ]);

    return { ...post, isLiked, isBookmarked };
  }

  async getPostLikes(postId: string, dto: GetPostsDto) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    await this.ensurePostLikesCached(postId);

    const cachedUserIds: string[] = await this.redis.smembers(`post:likes:users:${postId}`);
    if (cachedUserIds.length === 0) {
      return { data: [], nextCursor: null, hasMore: false };
    }

    const limit = dto.limit ?? 10;
    const cursorIndex = dto.cursor ? cachedUserIds.indexOf(dto.cursor) : -1;
    const startIndex = cursorIndex !== -1 ? cursorIndex + 1 : 0;
    const pageUserIds = cachedUserIds.slice(startIndex, startIndex + limit);

    const users = await Promise.all(
      pageUserIds.map((id) => this.usersRepository.findById(id)),
    );
    const validUsers = users.filter((u): u is NonNullable<typeof u> => !!u);

    const hasMore = startIndex + limit < cachedUserIds.length;
    const nextCursor = hasMore ? pageUserIds[pageUserIds.length - 1] : null;

    return {
      data: validUsers.map((u) => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatarUrl: u.avatarUrl,
        isVerified: u.isVerified,
      })),
      nextCursor,
      hasMore,
    };
  }

  async getUserPosts(
    username: string,
    currentUserId: string,
    dto: GetPostsDto,
  ) {
    const user = await this.usersRepository.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');

    const isBlocked = await this.usersRepository.isBlocked(
      user.id,
      currentUserId,
    );
    if (isBlocked) throw new NotFoundException('User not found');

    const posts = await this.postsRepository.getUserPosts(
      user.id,
      dto.limit ?? 10,
      dto.cursor,
    );

    const enrichedPosts = await this.enrichPostsWithCachedLikes(posts);

    return this.buildPaginatedResponse(enrichedPosts, dto.limit ?? 10, (post) =>
      this.postsRepository.encodeCursor(post.createdAt),
    );
  }

  async updatePost(postId: string, userId: string, dto: UpdatePostDto) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Not your post');

    return this.postsRepository.updatePost(postId, dto);
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Not your post');

    await this.postsRepository.deletePost(postId);

    // remove fan-out items and invalidate followers' feed caches
    await this.feedService.removeFanOutPost(postId, userId);

    return { message: 'Post deleted successfully' };
  }

  // ── Likes ──────────────────────────────────────────────
  async likePost(userId: string, postId: string) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    await this.ensurePostLikesCached(postId);

    const added = await this.redis.sadd(`post:likes:users:${postId}`, userId);
    if (added === 1 || added === true) {
      await this.redis.incr(`post:likes:count:${postId}`);
      await this.redis.sadd('likes:dirty:posts', postId);
    }

    await this.notificationsService.notifyLikePost(userId, post.authorId, postId);
    return { message: 'Post liked' };
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    await this.ensurePostLikesCached(postId);

    const removed = await this.redis.srem(`post:likes:users:${postId}`, userId);
    if (removed === 1 || removed === true) {
      const count = await this.redis.get(`post:likes:count:${postId}`);
      if (count && parseInt(count, 10) > 0) {
        await this.redis.decr(`post:likes:count:${postId}`);
      }
      await this.redis.sadd('likes:dirty:posts', postId);
    }

    await this.notificationsService.notifyUnlikePost(userId, postId);
    return { message: 'Post unliked' };
  }

  async likeComment(userId: string, commentId: string) {
    const comment = await this.postsRepository.findCommentById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    await this.ensureCommentLikesCached(commentId);

    const added = await this.redis.sadd(`comment:likes:users:${commentId}`, userId);
    if (added === 1 || added === true) {
      await this.redis.incr(`comment:likes:count:${commentId}`);
      await this.redis.sadd('likes:dirty:comments', commentId);
    }

    await this.notificationsService.notifyLikeComment(userId, comment.authorId, commentId);
    return { message: 'Comment liked' };
  }

  async unlikeComment(userId: string, commentId: string) {
    const comment = await this.postsRepository.findCommentById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    await this.ensureCommentLikesCached(commentId);

    const removed = await this.redis.srem(`comment:likes:users:${commentId}`, userId);
    if (removed === 1 || removed === true) {
      const count = await this.redis.get(`comment:likes:count:${commentId}`);
      if (count && parseInt(count, 10) > 0) {
        await this.redis.decr(`comment:likes:count:${commentId}`);
      }
      await this.redis.sadd('likes:dirty:comments', commentId);
    }

    await this.notificationsService.notifyUnlikeComment(userId, commentId);
    return { message: 'Comment unliked' };
  }

  // ── Comments ───────────────────────────────────────────
  async createComment(userId: string, postId: string, dto: CreateCommentDto) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    if (dto.parentCommentId) {
      const parent = await this.postsRepository.findCommentById(
        dto.parentCommentId,
      );
      if (!parent) throw new NotFoundException('Parent comment not found');
      await this.notificationsService.notifyReply(userId, parent.authorId, dto.parentCommentId);
    } else {
      await this.notificationsService.notifyComment(userId, post.authorId, postId);
    }

    return this.postsRepository.createComment({
      postId,
      authorId: userId,
      content: dto.content,
      parentCommentId: dto.parentCommentId ?? null,
    });
  }

  async getPostComments(postId: string, dto: GetPostsDto) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const comments = await this.postsRepository.getPostComments(
      postId,
      dto.limit ?? 10,
      dto.cursor,
    );

    await Promise.all(
      comments.map(async (c) => {
        const cachedCount = await this.redis.get(`comment:likes:count:${c.id}`);
        if (cachedCount !== null) {
          c.likeCount = parseInt(cachedCount, 10);
        }
      }),
    );

    return this.buildPaginatedResponse(comments, dto.limit ?? 10, (c) =>
      this.postsRepository.encodeCursor(c.createdAt),
    );
  }

  async getCommentReplies(commentId: string, dto: GetPostsDto) {
    const comment = await this.postsRepository.findCommentById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');

    const replies = await this.postsRepository.getCommentReplies(
      commentId,
      dto.limit ?? 10,
      dto.cursor,
    );

    await Promise.all(
      replies.map(async (r) => {
        const cachedCount = await this.redis.get(`comment:likes:count:${r.id}`);
        if (cachedCount !== null) {
          r.likeCount = parseInt(cachedCount, 10);
        }
      }),
    );

    return this.buildPaginatedResponse(replies, dto.limit ?? 10, (r) =>
      this.postsRepository.encodeCursor(r.createdAt),
    );
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.postsRepository.findCommentById(commentId);
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId)
      throw new ForbiddenException('Not your comment');

    await this.postsRepository.deleteComment(commentId, comment.postId);
    return { message: 'Comment deleted' };
  }

  // ── Bookmarks ──────────────────────────────────────────
  async bookmarkPost(userId: string, postId: string) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    await this.postsRepository.bookmarkPost(userId, postId);
    return { message: 'Post bookmarked' };
  }

  async unbookmarkPost(userId: string, postId: string) {
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotFoundException('Post not found');

    await this.postsRepository.unbookmarkPost(userId, postId);
    return { message: 'Post removed from bookmarks' };
  }

  async getUserBookmarks(userId: string, dto: GetPostsDto) {
    const bookmarks = await this.postsRepository.getUserBookmarks(
      userId,
      dto.limit ?? 10,
      dto.cursor,
    );

    const posts = bookmarks.map((b) => b.post);
    const enrichedPosts = await this.enrichPostsWithCachedLikes(posts);

    return this.buildPaginatedResponse(
      enrichedPosts,
      dto.limit ?? 10,
      (post) => this.postsRepository.encodeCursor(post.createdAt),
    );
  }

  async getPostsByHashtag(hashtagName: string, dto: GetPostsDto) {
    const postHashtags = await this.postsRepository.getPostsByHashtag(
      hashtagName,
      dto.limit ?? 10,
      dto.cursor,
    );

    const response = this.buildPaginatedResponse(
      postHashtags,
      dto.limit ?? 10,
      (entry) => this.postsRepository.encodeCursor(entry.createdAt),
    );

    const posts = response.data.map((entry) => entry.post);
    const enrichedPosts = await this.enrichPostsWithCachedLikes(posts);

    return {
      ...response,
      data: enrichedPosts,
    };
  }
}
