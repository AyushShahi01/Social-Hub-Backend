import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repositories/users.repository';
import { FeedModule } from '../feed/feed.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PresenceGateway } from './gateways/presence.gateway';
import { PresenceService } from './services/presence.service';

@Module({
  imports: [forwardRef(() => FeedModule), NotificationsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, PresenceService, PresenceGateway],
  exports: [UsersService, UsersRepository, PresenceService],
})
export class UsersModule { }
