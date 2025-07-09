import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResponseDto } from './dto/message.response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('all')
  async getAlll() {
    return this.messageService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-contact')
  @HttpCode(HttpStatus.OK)
  async getMessagesByContactId(
    @Query('contactId') contactId: string,
  ): Promise<MessageResponseDto[]> {
    console.log(contactId);
    return this.messageService.getMessagesByContactId(contactId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('mark-read')
  async markMessagesAsRead(
    @Body() body: { contact_id: string },
    @Req() req: Request,
  ) {
    const { contact_id } = body;

    // 从 JWT 认证通过后，req.user 里拿 user_id（即 sub）
    const receiver_id = req.user?.user_id;

    if (!receiver_id) {
      throw new UnauthorizedException('未认证的用户');
    }

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
