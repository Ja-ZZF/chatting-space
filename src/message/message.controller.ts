import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResponseDto } from './dto/message.response.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('all')
    async getAlll(){
        return this.messageService.getAll();
    }

  @Get('by-contact')
  @HttpCode(HttpStatus.OK)
  async getMessagesByContactId(@Query('contactId') contactId: string): Promise<MessageResponseDto[]> {
    console.log(contactId);
    return this.messageService.getMessagesByContactId(contactId);
  }
}