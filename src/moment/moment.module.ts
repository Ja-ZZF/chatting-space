import { Module } from '@nestjs/common';
import { MomentService } from './moment.service';
import { MomentController } from './moment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moment } from './entities/moment.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Moment,User])],
  providers: [MomentService],
  controllers: [MomentController],
  exports:[MomentService],
})
export class MomentModule {}
