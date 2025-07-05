import { Module } from '@nestjs/common';
import { UserRemarkService } from './user_remark.service';
import { UserRemarkController } from './user_remark.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRemark } from './entities/user_remark.entity';

@Module({
  imports :[TypeOrmModule.forFeature([UserRemark])],
  providers: [UserRemarkService],
  controllers: [UserRemarkController],
  exports:[UserRemarkService],
})
export class UserRemarkModule {}
