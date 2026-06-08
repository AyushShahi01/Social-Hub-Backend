# Graph Report - .  (2026-06-07)

## Corpus Check
- Corpus is ~17,486 words - fits in a single context window. You may not need a graph.

## Summary
- 410 nodes · 388 edges · 47 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Posts Data Repository|Posts Data Repository]]
- [[_COMMUNITY_Posts Logic Service|Posts Logic Service]]
- [[_COMMUNITY_Users Data Repository|Users Data Repository]]
- [[_COMMUNITY_Feed Generation Service|Feed Generation Service]]
- [[_COMMUNITY_Posts HTTP Controller|Posts HTTP Controller]]
- [[_COMMUNITY_Feed Data Repository|Feed Data Repository]]
- [[_COMMUNITY_Users HTTP Controller|Users HTTP Controller]]
- [[_COMMUNITY_Authentication Data Repository|Authentication Data Repository]]
- [[_COMMUNITY_Users Logic Service|Users Logic Service]]
- [[_COMMUNITY_Notifications Logic Service|Notifications Logic Service]]
- [[_COMMUNITY_Authentication HTTP Controller|Authentication HTTP Controller]]
- [[_COMMUNITY_Authentication Logic Service|Authentication Logic Service]]
- [[_COMMUNITY_Chat WebSocket Gateway|Chat WebSocket Gateway]]
- [[_COMMUNITY_Application Configuration|Application Configuration]]
- [[_COMMUNITY_Notifications Data Repository|Notifications Data Repository]]
- [[_COMMUNITY_User Presence Service|User Presence Service]]
- [[_COMMUNITY_Chat HTTP Controller|Chat HTTP Controller]]
- [[_COMMUNITY_Chat Logic Service|Chat Logic Service]]
- [[_COMMUNITY_Notifications HTTP Controller|Notifications HTTP Controller]]
- [[_COMMUNITY_Feed HTTP Controller|Feed HTTP Controller]]
- [[_COMMUNITY_Redis Socket.IO Adapter|Redis Socket.IO Adapter]]
- [[_COMMUNITY_Notifications WebSocket Gateway|Notifications WebSocket Gateway]]
- [[_COMMUNITY_Presence WebSocket Gateway|Presence WebSocket Gateway]]
- [[_COMMUNITY_App Root Controller|App Root Controller]]
- [[_COMMUNITY_JWT Refresh Authentication Strategy|JWT Refresh Authentication Strategy]]
- [[_COMMUNITY_JWT Access Authentication Strategy|JWT Access Authentication Strategy]]
- [[_COMMUNITY_App Root Service|App Root Service]]
- [[_COMMUNITY_Database Module|Database Module]]
- [[_COMMUNITY_Redis Cache Module|Redis Cache Module]]
- [[_COMMUNITY_Auth NestJS Module|Auth NestJS Module]]
- [[_COMMUNITY_Login DTO Schema|Login DTO Schema]]
- [[_COMMUNITY_Register DTO Schema|Register DTO Schema]]
- [[_COMMUNITY_JWT Auth HTTP Guard|JWT Auth HTTP Guard]]
- [[_COMMUNITY_JWT Refresh HTTP Guard|JWT Refresh HTTP Guard]]
- [[_COMMUNITY_Chat NestJS Module|Chat NestJS Module]]
- [[_COMMUNITY_Feed NestJS Module|Feed NestJS Module]]
- [[_COMMUNITY_Get Feed DTO Schema|Get Feed DTO Schema]]
- [[_COMMUNITY_Notifications NestJS Module|Notifications NestJS Module]]
- [[_COMMUNITY_Get Notifications DTO Schema|Get Notifications DTO Schema]]
- [[_COMMUNITY_Posts NestJS Module|Posts NestJS Module]]
- [[_COMMUNITY_Create Comment DTO Schema|Create Comment DTO Schema]]
- [[_COMMUNITY_Create Post DTO Schema|Create Post DTO Schema]]
- [[_COMMUNITY_Get Posts DTO Schema|Get Posts DTO Schema]]
- [[_COMMUNITY_Update Post DTO Schema|Update Post DTO Schema]]
- [[_COMMUNITY_Users NestJS Module|Users NestJS Module]]
- [[_COMMUNITY_Search Users DTO Schema|Search Users DTO Schema]]
- [[_COMMUNITY_Update Profile DTO Schema|Update Profile DTO Schema]]

## God Nodes (most connected - your core abstractions)
1. `PostsRepository` - 28 edges
2. `PostsService` - 23 edges
3. `UsersRepository` - 23 edges
4. `FeedService` - 21 edges
5. `PostsController` - 20 edges
6. `FeedRepository` - 18 edges
7. `UsersController` - 18 edges
8. `AuthRepository` - 17 edges
9. `UsersService` - 17 edges
10. `NotificationsService` - 14 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Posts Data Repository"
Cohesion: 0.08
Nodes (1): PostsRepository

### Community 1 - "Posts Logic Service"
Cohesion: 0.11
Nodes (1): PostsService

### Community 2 - "Users Data Repository"
Cohesion: 0.09
Nodes (1): UsersRepository

### Community 3 - "Feed Generation Service"
Cohesion: 0.18
Nodes (1): FeedService

### Community 4 - "Posts HTTP Controller"
Cohesion: 0.1
Nodes (1): PostsController

### Community 5 - "Feed Data Repository"
Cohesion: 0.13
Nodes (1): FeedRepository

### Community 6 - "Users HTTP Controller"
Cohesion: 0.11
Nodes (1): UsersController

### Community 7 - "Authentication Data Repository"
Cohesion: 0.11
Nodes (1): AuthRepository

### Community 8 - "Users Logic Service"
Cohesion: 0.11
Nodes (1): UsersService

### Community 9 - "Notifications Logic Service"
Cohesion: 0.13
Nodes (1): NotificationsService

### Community 10 - "Authentication HTTP Controller"
Cohesion: 0.18
Nodes (3): AuthController, ApiAuthEndpoint(), ApiPublicEndpoint()

### Community 11 - "Authentication Logic Service"
Cohesion: 0.27
Nodes (1): AuthService

### Community 12 - "Chat WebSocket Gateway"
Cohesion: 0.15
Nodes (5): ChatGateway, JoinConversationDto, ReadDto, SendMessageDto, TypingDto

### Community 13 - "Application Configuration"
Cohesion: 0.23
Nodes (5): getOptionalEnv(), getRequiredEnv(), readEnvValue(), validateEnv(), AppModule

### Community 14 - "Notifications Data Repository"
Cohesion: 0.2
Nodes (1): NotificationsRepository

### Community 15 - "User Presence Service"
Cohesion: 0.25
Nodes (1): PresenceService

### Community 16 - "Chat HTTP Controller"
Cohesion: 0.29
Nodes (2): ChatController, CreateConversationDto

### Community 17 - "Chat Logic Service"
Cohesion: 0.29
Nodes (1): ChatService

### Community 18 - "Notifications HTTP Controller"
Cohesion: 0.29
Nodes (1): NotificationsController

### Community 19 - "Feed HTTP Controller"
Cohesion: 0.33
Nodes (1): FeedController

### Community 20 - "Redis Socket.IO Adapter"
Cohesion: 0.4
Nodes (1): RedisIoAdapter

### Community 21 - "Notifications WebSocket Gateway"
Cohesion: 0.4
Nodes (1): NotificationsGateway

### Community 22 - "Presence WebSocket Gateway"
Cohesion: 0.4
Nodes (1): PresenceGateway

### Community 23 - "App Root Controller"
Cohesion: 0.5
Nodes (1): AppController

### Community 24 - "JWT Refresh Authentication Strategy"
Cohesion: 0.5
Nodes (1): JwtRefreshStrategy

### Community 25 - "JWT Access Authentication Strategy"
Cohesion: 0.5
Nodes (1): JwtStrategy

### Community 26 - "App Root Service"
Cohesion: 0.67
Nodes (1): AppService

### Community 28 - "Database Module"
Cohesion: 1.0
Nodes (1): DatabaseModule

### Community 29 - "Redis Cache Module"
Cohesion: 1.0
Nodes (1): CacheModule

### Community 30 - "Auth NestJS Module"
Cohesion: 1.0
Nodes (1): AuthModule

### Community 31 - "Login DTO Schema"
Cohesion: 1.0
Nodes (1): LoginDto

### Community 32 - "Register DTO Schema"
Cohesion: 1.0
Nodes (1): RegisterDto

### Community 33 - "JWT Auth HTTP Guard"
Cohesion: 1.0
Nodes (1): JwtAuthGuard

### Community 34 - "JWT Refresh HTTP Guard"
Cohesion: 1.0
Nodes (1): JwtRefreshGuard

### Community 36 - "Chat NestJS Module"
Cohesion: 1.0
Nodes (1): ChatModule

### Community 37 - "Feed NestJS Module"
Cohesion: 1.0
Nodes (1): FeedModule

### Community 38 - "Get Feed DTO Schema"
Cohesion: 1.0
Nodes (1): GetFeedDto

### Community 39 - "Notifications NestJS Module"
Cohesion: 1.0
Nodes (1): NotificationsModule

### Community 40 - "Get Notifications DTO Schema"
Cohesion: 1.0
Nodes (1): GetNotificationsDto

### Community 41 - "Posts NestJS Module"
Cohesion: 1.0
Nodes (1): PostsModule

### Community 42 - "Create Comment DTO Schema"
Cohesion: 1.0
Nodes (1): CreateCommentDto

### Community 43 - "Create Post DTO Schema"
Cohesion: 1.0
Nodes (1): CreatePostDto

### Community 44 - "Get Posts DTO Schema"
Cohesion: 1.0
Nodes (1): GetPostsDto

### Community 45 - "Update Post DTO Schema"
Cohesion: 1.0
Nodes (1): UpdatePostDto

### Community 46 - "Users NestJS Module"
Cohesion: 1.0
Nodes (1): UsersModule

### Community 47 - "Search Users DTO Schema"
Cohesion: 1.0
Nodes (1): SearchUsersDto

### Community 48 - "Update Profile DTO Schema"
Cohesion: 1.0
Nodes (1): UpdateProfileDto

## Knowledge Gaps
- **26 isolated node(s):** `AppModule`, `DatabaseModule`, `CacheModule`, `AuthModule`, `LoginDto` (+21 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Posts Data Repository`** (29 nodes): `PostsRepository`, `.bookmarkPost()`, `.constructor()`, `.createComment()`, `.createMention()`, `.createPost()`, `.deleteComment()`, `.deletePost()`, `.encodeCursor()`, `.findCommentById()`, `.findPostById()`, `.getCommentReplies()`, `.getCursorDate()`, `.getPostComments()`, `.getPostLikes()`, `.getPostsByHashtag()`, `.getUserBookmarks()`, `.getUserPosts()`, `.isBookmarked()`, `.isLiked()`, `.likeComment()`, `.likePost()`, `.linkHashtagToPost()`, `.unbookmarkPost()`, `.unlikeComment()`, `.unlikePost()`, `.updatePost()`, `.upsertHashtag()`, `posts.repository.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Posts Logic Service`** (24 nodes): `PostsService`, `.bookmarkPost()`, `.buildPaginatedResponse()`, `.constructor()`, `.createComment()`, `.createPost()`, `.deleteComment()`, `.deletePost()`, `.extractHashtags()`, `.extractMentions()`, `.getCommentReplies()`, `.getPost()`, `.getPostComments()`, `.getPostLikes()`, `.getPostsByHashtag()`, `.getUserBookmarks()`, `.getUserPosts()`, `.likeComment()`, `.likePost()`, `.unbookmarkPost()`, `.unlikeComment()`, `.unlikePost()`, `.updatePost()`, `posts.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users Data Repository`** (24 nodes): `UsersRepository`, `.blockUser()`, `.constructor()`, `.deleteUser()`, `.findById()`, `.findByUsername()`, `.follow()`, `.getBlockedIds()`, `.getBlockedUsers()`, `.getFollowerCount()`, `.getFollowers()`, `.getFollowing()`, `.getFollowingCount()`, `.getMutedUsers()`, `.isBlocked()`, `.isFollowing()`, `.isMuted()`, `.muteUser()`, `.searchUsers()`, `.unblockUser()`, `.unfollow()`, `.unmuteUser()`, `.updateUser()`, `users.repository.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feed Generation Service`** (22 nodes): `FeedService`, `.backfillFeedOnFollow()`, `.buildPaginatedResponse()`, `.cleanFeedOnUnfollow()`, `.constructor()`, `.deleteCacheKeys()`, `.describeRedisError()`, `.enrichWithStatuses()`, `.fanOutPost()`, `.getCreatedAt()`, `.getFollowingFeed()`, `.getHomeFeed()`, `.getPostId()`, `.getTrendingFeed()`, `.invalidateUserFeed()`, `.isInboxItem()`, `.mergeSortDeduplicate()`, `.normalizePost()`, `.readCache()`, `.removeFanOutPost()`, `.writeCache()`, `feed.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Posts HTTP Controller`** (21 nodes): `PostsController`, `.bookmarkPost()`, `.constructor()`, `.createComment()`, `.createPost()`, `.deleteComment()`, `.deletePost()`, `.getCommentReplies()`, `.getPost()`, `.getPostComments()`, `.getPostLikes()`, `.getPostsByHashtag()`, `.getUserBookmarks()`, `.getUserPosts()`, `.likeComment()`, `.likePost()`, `.unbookmarkPost()`, `.unlikeComment()`, `.unlikePost()`, `.updatePost()`, `posts.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feed Data Repository`** (19 nodes): `FeedRepository`, `.constructor()`, `.decodeCursor()`, `.encodeCursor()`, `.fanOutPostToFollowers()`, `.getBookmarkedStatuses()`, `.getCelebrityFollowingIds()`, `.getCelebrityPosts()`, `.getFeedInboxPosts()`, `.getFollowerIds()`, `.getFollowingIds()`, `.getFollowingPostsChronological()`, `.getLikedStatuses()`, `.getTrendingPosts()`, `.getUserPostIds()`, `.isCelebrity()`, `.removeFeedItemsForAuthor()`, `.removeFeedItemsForPost()`, `feed.repository.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users HTTP Controller`** (19 nodes): `UsersController`, `.blockUser()`, `.constructor()`, `.deleteAccount()`, `.followUser()`, `.getBlockedUsers()`, `.getFollowers()`, `.getFollowing()`, `.getMutedUsers()`, `.getMyProfile()`, `.getProfile()`, `.getUserPresence()`, `.muteUser()`, `.searchUsers()`, `.unblockUser()`, `.unfollowUser()`, `.unmuteUser()`, `.updateProfile()`, `users.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Authentication Data Repository`** (18 nodes): `AuthRepository`, `.constructor()`, `.createEmailVerification()`, `.createPasswordReset()`, `.createSession()`, `.createUser()`, `.findEmailVerification()`, `.findPasswordReset()`, `.findSessionByUserId()`, `.findUserByEmail()`, `.findUserById()`, `.findUserByUsername()`, `.markEmailVerificationUsed()`, `.markPasswordResetUsed()`, `.revokeAllUserSessions()`, `.revokeSession()`, `.updateUser()`, `auth.repository.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users Logic Service`** (18 nodes): `UsersService`, `.blockUser()`, `.constructor()`, `.deleteAccount()`, `.followUser()`, `.getBlockedUsers()`, `.getFollowers()`, `.getFollowing()`, `.getMutedUsers()`, `.getMyProfile()`, `.getProfile()`, `.muteUser()`, `.searchUsers()`, `.unblockUser()`, `.unfollowUser()`, `.unmuteUser()`, `.updateProfile()`, `users.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notifications Logic Service`** (15 nodes): `NotificationsService`, `.constructor()`, `.getNotifications()`, `.getUnreadCount()`, `.markAllAsRead()`, `.markAsRead()`, `.notifyComment()`, `.notifyFollow()`, `.notifyLikeComment()`, `.notifyLikePost()`, `.notifyMention()`, `.notifyReply()`, `.notifyUnlikeComment()`, `.notifyUnlikePost()`, `notifications.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Authentication Logic Service`** (13 nodes): `AuthService`, `.constructor()`, `.forgotPassword()`, `.generateSecureToken()`, `.generateTokens()`, `.getMe()`, `.hashToken()`, `.login()`, `.logout()`, `.refreshTokens()`, `.register()`, `.resetPassword()`, `auth.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notifications Data Repository`** (10 nodes): `NotificationsRepository`, `.constructor()`, `.createNotification()`, `.deleteNotification()`, `.encodeCursor()`, `.getNotifications()`, `.getUnreadCount()`, `.markAllAsRead()`, `.markAsRead()`, `notification.repository.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `User Presence Service`** (8 nodes): `PresenceService`, `.constructor()`, `.isOnline()`, `.notifyFollowers()`, `.setOffline()`, `.setOnline()`, `.setTyping()`, `presence.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat HTTP Controller`** (7 nodes): `ChatController`, `.constructor()`, `.createConversation()`, `.getMessages()`, `.listConversations()`, `CreateConversationDto`, `chat.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat Logic Service`** (7 nodes): `ChatService`, `.constructor()`, `.createConversation()`, `.getMessages()`, `.listConversations()`, `.markRead()`, `chat.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notifications HTTP Controller`** (7 nodes): `NotificationsController`, `.constructor()`, `.getNotifications()`, `.getUnreadCount()`, `.markAllAsRead()`, `.markAsRead()`, `notifications.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feed HTTP Controller`** (6 nodes): `FeedController`, `.constructor()`, `.getFollowingFeed()`, `.getHomeFeed()`, `.getTrendingFeed()`, `feed.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Redis Socket.IO Adapter`** (5 nodes): `RedisIoAdapter`, `.connectToRedis()`, `.constructor()`, `.createIOServer()`, `redis-io.adapter.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notifications WebSocket Gateway`** (5 nodes): `NotificationsGateway`, `.constructor()`, `.handleConnection()`, `.handleDisconnect()`, `notifications.gateway.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Presence WebSocket Gateway`** (5 nodes): `PresenceGateway`, `.constructor()`, `.handleConnection()`, `.handleDisconnect()`, `presence.gateway.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Root Controller`** (4 nodes): `AppController`, `.constructor()`, `.getHello()`, `app.controller.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `JWT Refresh Authentication Strategy`** (4 nodes): `jwt-refresth.strategy.ts`, `JwtRefreshStrategy`, `.constructor()`, `.validate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `JWT Access Authentication Strategy`** (4 nodes): `jwt.strategy.ts`, `JwtStrategy`, `.constructor()`, `.validate()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Root Service`** (3 nodes): `AppService`, `.getHello()`, `app.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Database Module`** (2 nodes): `DatabaseModule`, `database.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Redis Cache Module`** (2 nodes): `CacheModule`, `redis.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth NestJS Module`** (2 nodes): `AuthModule`, `auth.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Login DTO Schema`** (2 nodes): `LoginDto`, `login.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Register DTO Schema`** (2 nodes): `RegisterDto`, `register.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `JWT Auth HTTP Guard`** (2 nodes): `JwtAuthGuard`, `jwt-auth.guard.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `JWT Refresh HTTP Guard`** (2 nodes): `JwtRefreshGuard`, `jwt-refresh.guard.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Chat NestJS Module`** (2 nodes): `ChatModule`, `chat.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Feed NestJS Module`** (2 nodes): `FeedModule`, `feed.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Feed DTO Schema`** (2 nodes): `GetFeedDto`, `get-feed.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Notifications NestJS Module`** (2 nodes): `NotificationsModule`, `notifications.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Notifications DTO Schema`** (2 nodes): `GetNotificationsDto`, `get-notifications.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Posts NestJS Module`** (2 nodes): `PostsModule`, `posts.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Comment DTO Schema`** (2 nodes): `CreateCommentDto`, `create-comment.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Create Post DTO Schema`** (2 nodes): `CreatePostDto`, `create-post.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Get Posts DTO Schema`** (2 nodes): `GetPostsDto`, `get-posts.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Post DTO Schema`** (2 nodes): `UpdatePostDto`, `update-post.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users NestJS Module`** (2 nodes): `users.module.ts`, `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Search Users DTO Schema`** (2 nodes): `SearchUsersDto`, `search-users.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Update Profile DTO Schema`** (2 nodes): `UpdateProfileDto`, `update-profile.dto.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `AppModule`, `DatabaseModule`, `CacheModule` to the rest of the system?**
  _26 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Posts Data Repository` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Posts Logic Service` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Users Data Repository` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Posts HTTP Controller` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Feed Data Repository` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Users HTTP Controller` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._