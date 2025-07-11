import { Module } from '@nestjs/common';
import { MomentService } from './moment.service';
import { MomentController } from './moment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moment } from './entities/moment.entity';
import { User } from 'src/users/entities/user.entity';
import { ContactModule } from 'src/contacts/contact.module';

@Module({
  imports: [TypeOrmModule.forFeature([Moment, User]),ContactModule],
  providers: [MomentService],
  controllers: [MomentController],
  exports: [MomentService],
})
export class MomentModule {}
