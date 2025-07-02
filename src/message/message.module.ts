//message.module
import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageGateway } from './gateways/message.gateway';
import { User } from 'src/users/entities/user.entity';
import { LatestMessageView } from './entities/latest-message-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message,User,LatestMessageView])],
  providers: [MessageService,MessageGateway],
  controllers: [MessageController]
})
export class MessageModule {}
