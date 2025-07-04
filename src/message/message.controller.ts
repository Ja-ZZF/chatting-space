import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResponseDto } from './dto/message.response.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('all')
  async getAlll() {
    return this.messageService.getAll();
  }

  @Get('by-contact')
  @HttpCode(HttpStatus.OK)
  async getMessagesByContactId(
    @Query('contactId') contactId: string,
  ): Promise<MessageResponseDto[]> {
    console.log(contactId);
    return this.messageService.getMessagesByContactId(contactId);
  }

  @Patch('mark-read')
  async markMessagesAsRead(
    @Body() body: { contact_id: string; receiver_id: string },
  ) {
    const { contact_id, receiver_id } = body;

    const updatedMessages = await this.messageService.markMessagesAsRead(
      contact_id,
      receiver_id,
    );

    return {
      success: true,
      updated_count: updatedMessages.length,
      message_ids: updatedMessages.map((m) => m.message_id),
    };
  }
  
}
