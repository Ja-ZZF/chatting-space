import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ContactRequestService } from './contact_request.service';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { ContactRequest } from './entities/contact_request.entity';
import { ContactRequestResponseDto } from './dto/contact-request-response.dto';

@Controller('contact-request')
export class ContactRequestController {
  constructor(private readonly contactRequestService: ContactRequestService) {}

  /**
   * ✅ 查询某用户发出的所有好友请求
   * GET /contact-request/sent/:userId
   */
  @Get('sent/:userId')
  async getSentRequests(
    @Param('userId') userId: string,
  ): Promise<ContactRequestResponseDto[]> {
    return this.contactRequestService.findSentRequests(userId);
  }

  /**
   * ✅ 查询某用户收到的所有好友请求
   * GET /contact-request/received/:userId
   */
  @Get('received/:userId')
  async getReceivedRequests(
    @Param('userId') userId: string,
  ): Promise<ContactRequestResponseDto[]> {
    return this.contactRequestService.findReceivedRequests(userId);
  }

  /**
   * ✅ 发起一条好友请求
   * POST /contact-request
   */
  @Post()
  async createRequest(
    @Body() dto: CreateContactRequestDto,
  ): Promise<ContactRequest> {
    if (dto.requester_id === dto.target_id) {
      throw new BadRequestException('不能向自己发送好友请求');
    }

    return this.contactRequestService.createRequest(dto);
  }

  /**
   * ✅ 接受好友请求
   * POST /contact-request/:requestId/accept
   */
  @Post(':requestId/accept')
  @HttpCode(HttpStatus.NO_CONTENT) // 返回 204，代表处理成功无响应体
  async acceptRequest(@Param('requestId') requestId: string): Promise<void> {
    await this.contactRequestService.acceptRequest(requestId);
  }

  /**
   * ✅ 拒绝好友请求
   * POST /contact-request/:requestId/reject
   */
  @Post(':requestId/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  async rejectRequest(@Param('requestId') requestId: string): Promise<void> {
    await this.contactRequestService.rejectRequest(requestId);
  }

  /**
   * 调试用
   * 获取全部request
   */
  @Get()
  async getAll(){
    return this.contactRequestService.findAll();
  }
}
