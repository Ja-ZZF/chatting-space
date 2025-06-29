import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { User } from 'src/user/user.entity';
import { MessageGateway } from './message.gateway';
import { Friend } from 'src/friend/friend.entity';
import { FriendService } from 'src/friend/friend.service';
import { FriendModule } from 'src/friend/friend.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Message,User,Friend]),
    FriendModule,
  ],
  providers: [MessageService,MessageGateway],
  controllers: [MessageController]
})
export class MessageModule {}
