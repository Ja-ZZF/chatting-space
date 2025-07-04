// src/contacts/controllers/contact.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactResponseDto } from './dto/response-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactWithOtherUserDto } from './dto/contact-with-other-user.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('all')
  async getAll(){
    return this.contactService.findAll();
  }

  //根据用户id查询所有contact
  @Get()
  async getContacts(
    @Query('userId') userId: string,
  ): Promise<ContactWithOtherUserDto[]> {
    if (!userId) {
      throw new BadRequestException('Missing userId query parameter');
    }
    return this.contactService.findAllByUserId(userId);
  }

  //根据contactId查询
  @Get(':id')
  async getContact(@Param('id') id: string): Promise<ContactResponseDto> {
    return this.contactService.findOne(id);
  }

  // 新增联系人
  @Post('add')
  async createContact(
    @Body() createContactDto: CreateContactDto,
  ): Promise<ContactResponseDto> {
    return this.contactService.create(createContactDto);
  }

  // 删除联系人
  @Delete('delete/:id')
  async deleteContact(@Param('id') id: string): Promise<void> {
    return this.contactService.delete(id);
  }

  @Put(':contactId/clear-unread')
  async clearUnread(
    @Param('contactId') contactId: string,
    @Query('userId') userId: string,
  ): Promise<void> {
    if (!userId || !contactId) {
      throw new BadRequestException('Missing userId or contactId');
    }
    return this.contactService.clearUnreadForUser(userId, contactId);
  }
}
