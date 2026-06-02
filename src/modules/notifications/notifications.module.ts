import { Module } from '@nestjs/common';
import { NotificationsController } from './controllers/notifications.controller';
import { NotificationsService } from './services/notifications.service';
import { NotificationsRepository } from './repositories/notification.repository';
import { NotificationsGateway } from './gateways/notifications.gateway';

@Module({
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationsRepository, NotificationsGateway],
    exports: [NotificationsService],
})
export class NotificationsModule { }
