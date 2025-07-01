import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { Contact } from './entities/contact.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LatestMessageView } from 'src/message/entities/latest-message-view.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact,LatestMessageView])],
  providers: [ContactService],
  controllers: [ContactController]
})
export class ContactModule {}
