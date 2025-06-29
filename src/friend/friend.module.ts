import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Friend,User]),
    UserModule,
  ],
  providers: [FriendService],
  controllers: [FriendController],
  exports :[FriendService],

})
export class FriendModule {}
