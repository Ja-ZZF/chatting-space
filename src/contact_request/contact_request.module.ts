import { Module } from '@nestjs/common';
import { ContactRequestService } from './contact_request.service';
import { ContactRequestController } from './contact_request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactRequest } from './entities/contact_request.entity';
import { User } from 'src/users/entities/user.entity';
import { ContactModule } from 'src/contacts/contact.module';

@Module({
  imports:[TypeOrmModule.forFeature([User,ContactRequest]),ContactModule],
  providers: [ContactRequestService],
  controllers: [ContactRequestController]
})
export class ContactRequestModule {}
