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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactResponseDto } from './dto/response-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactWithOtherUserDto } from './dto/contact-with-other-user.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('all')
  async getAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-user')
  async getContacts(@Req() req: Request): Promise<ContactWithOtherUserDto[]> {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }

    return this.contactService.findAllByUserId(userId);
  }

  //根据contactId查询
  // @Get(':id')
  // async getContact(@Param('id') id: string): Promise<ContactResponseDto> {
  //   return this.contactService.findOne(id);
  // }

  // 新增联系人
  // @Post('add')
  // async createContact(
  //   @Body() createContactDto: CreateContactDto,
  // ): Promise<ContactResponseDto> {
  //   return this.contactService.create(createContactDto);
  // }

  // 删除联系人
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  async deleteContact(@Param('id') id: string): Promise<void> {
    return this.contactService.delete(id);
  }
  
  //清除未读
  @UseGuards(JwtAuthGuard)
  @Post('clear-unread')
  async clearUnread(
    @Body('contact_id') contact_id: string,
    @Req() req: Request,
  ): Promise<void> {
    const userId = req.user?.user_id;

    if (!userId || !contact_id) {
      throw new BadRequestException('Missing userId or contactId');
    }

    return this.contactService.clearUnreadForUser(userId, contact_id);
  }
}
