import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  BadRequestException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ContactRequestService } from './contact_request.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { ContactRequest } from './entities/contact_request.entity';
import { ContactRequestResponseDto } from './dto/contact-request-response.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('contact-request')
export class ContactRequestController {
  constructor(private readonly contactRequestService: ContactRequestService) {}

  /**
   * ✅ 查询某用户发出的所有好友请求
   * GET /contact-request/sent/:userId
   */
  @UseGuards(JwtAuthGuard)
  @Get('sent')
  async getSentRequests(
    @Req() req: Request,
  ): Promise<ContactRequestResponseDto[]> {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.contactRequestService.findSentRequests(userId);
  }

  /**
   * ✅ 查询某用户收到的所有好友请求
   * GET /contact-request/received/:userId
   */
  @UseGuards(JwtAuthGuard)
  @Get('received')
  async getReceivedRequests(
    @Req() req: Request,
  ): Promise<ContactRequestResponseDto[]> {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    return this.contactRequestService.findReceivedRequests(userId);
  }

  /**
   * ✅ 发起一条好友请求
   * POST /contact-request
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createRequest(
    @Req() req: Request,
    @Body() body: { target_id: string; message?: string },
  ): Promise<ContactRequest> {
    const requester_id = req.user?.user_id;
    const { target_id, message } = body;

    if (!requester_id) {
      throw new BadRequestException('未认证的用户');
    }

    if (requester_id === target_id) {
      throw new BadRequestException('不能向自己发送好友请求');
    }

    const dto: CreateContactRequestDto = {
      requester_id,
      target_id,
      message,
    };

    return this.contactRequestService.createRequest(dto);
  }

  /**
   * ✅ 接受好友请求
   * POST /contact-request/accept
   */
  @UseGuards(JwtAuthGuard)
  @Post('accept')
  @HttpCode(HttpStatus.NO_CONTENT) // 返回 204，无响应体
  async acceptRequest(@Body('requestId') requestId: string): Promise<void> {
    if (!requestId) {
      throw new BadRequestException('requestId is required');
    }
    await this.contactRequestService.acceptRequest(requestId);
  }

  /**
   * ✅ 拒绝好友请求
   * POST /contact-request/reject
   */
  @UseGuards(JwtAuthGuard)
  @Post('reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectRequest(@Body('requestId') requestId: string): Promise<void> {
    if (!requestId) {
      throw new BadRequestException('requestId is required');
    }
    await this.contactRequestService.rejectRequest(requestId);
  }

  /**
   * 调试用
   * 获取全部request
   */
  @Get()
  async getAll() {
    return this.contactRequestService.findAll();
  }
}
