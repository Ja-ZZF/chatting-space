// src/contacts/controllers/contact.controller.ts
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactResponseDto } from './dto/response-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getContacts(): Promise<ContactResponseDto[]> {
    const userId = '当前登录用户ID'; // 实际中从 req.user 中获取
    return this.contactService.findAllByUserId(userId);
  }

  @Get(':id')
  async getContact(@Param('id') id: string): Promise<ContactResponseDto> {
    return this.contactService.findOne(id);
  }

  // 新增联系人
  @Post()
  async createContact(@Body() createContactDto: CreateContactDto): Promise<ContactResponseDto> {
    return this.contactService.create(createContactDto);
  }

  // 删除联系人
  @Delete(':id')
  async deleteContact(@Param('id') id: string): Promise<void> {
    return this.contactService.delete(id);
  }
}