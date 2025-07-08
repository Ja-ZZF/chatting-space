import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './entities/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestMessageView } from 'src/message/entities/latest-message-view.entity';
import { MessageModule } from 'src/message/message.module';
import { UserRemarkModule } from 'src/user_remark/user_remark.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contact,LatestMessageView]),MessageModule,UserRemarkModule],
  providers: [ContactService],
  controllers: [ContactController],
  exports:[ContactService],
})
export class ContactModule {}
