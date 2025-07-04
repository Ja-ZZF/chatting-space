import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ContactRequest,
  ContactRequestStatus,
} from './entities/contact_request.entity';
import { CreateContactRequestDto } from './dto/create-contact-request.dto';
import { ContactRequestResponseDto } from './dto/contact-request-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ContactService } from 'src/contacts/contact.service';
import { CreateContactDto } from 'src/contacts/dto/create-contact.dto';

@Injectable()
export class ContactRequestService {

  constructor(
    @InjectRepository(ContactRequest)
    private readonly contactRequestRepo: Repository<ContactRequest>,
    private readonly contactService: ContactService,
  ) {}

  /**
   * ✅ 方法一：查询某用户发出的所有好友请求
   */
  async findSentRequests(userId: string): Promise<ContactRequestResponseDto[]> {
    const requests = await this.contactRequestRepo.find({
      where: { requester_id: userId },
      relations: ['target'],
      order: { created_at: 'DESC' },
    });

    return requests.map((r) => {
      return new ContactRequestResponseDto({
        request_id: r.request_id,
        requester_id: r.requester_id,
        target_id: r.target_id,
        message: r.message,
        status: r.status,
        created_at: r.created_at,
        responded_at: r.responded_at,
        target: new UserResponseDto({
          user_id: r.target.user_id,
          username: r.target.username,
          display_name: r.target.display_name,
          avatar_url: r.target.avatar_url,
          created_at: r.target.created_at,
        }),
      });
    });
  }

  /**
   * ✅ 方法二：查询某用户收到的所有好友请求
   */
  async findReceivedRequests(
    userId: string,
  ): Promise<ContactRequestResponseDto[]> {
    const requests = await this.contactRequestRepo.find({
      where: { target_id: userId },
      relations: ['requester'],
      order: { created_at: 'DESC' },
    });

    return requests.map((r) => {
      return new ContactRequestResponseDto({
        request_id: r.request_id,
        requester_id: r.requester_id,
        target_id: r.target_id,
        message: r.message,
        status: r.status,
        created_at: r.created_at,
        responded_at: r.responded_at,
        requester: new UserResponseDto({
          user_id: r.requester.user_id,
          username: r.requester.username,
          display_name: r.requester.display_name,
          avatar_url: r.requester.avatar_url,
          created_at: r.requester.created_at,
        }),
      });
    });
  }

  /**
   * ✅ 方法三：创建好友请求（默认状态为 pending）
   */
  async createRequest(dto: CreateContactRequestDto): Promise<ContactRequest> {
    const existing = await this.contactRequestRepo.findOne({
      where: {
        requester_id: dto.requester_id,
        target_id: dto.target_id,
        status: ContactRequestStatus.PENDING,
      },
    });

    if (existing) {
      throw new Error('已存在待处理的好友请求');
    }

    const request = this.contactRequestRepo.create({
      requester_id: dto.requester_id,
      target_id: dto.target_id,
      message: dto.message,
      status: ContactRequestStatus.PENDING,
    });

    return await this.contactRequestRepo.save(request);
  }

    // ✅ 接受请求
  async acceptRequest(requestId: string): Promise<void> {
    const request = await this.contactRequestRepo.findOne({
      where: { request_id: requestId },
    });

    if (!request) {
      throw new NotFoundException('好友请求不存在');
    }

    if (request.status !== ContactRequestStatus.PENDING) {
      throw new BadRequestException('该请求已被处理');
    }

    // ✅ 构建 DTO 传给 ContactService
    const createDto: CreateContactDto = {
      userAId: request.requester_id,
      userBId: request.target_id,
    };

    await this.contactService.create(createDto);

    // ✅ 更新请求状态
    request.status = ContactRequestStatus.ACCEPTED;
    request.responded_at = new Date();

    await this.contactRequestRepo.save(request);
  }

  // ✅ 拒绝请求
  async rejectRequest(requestId: string): Promise<void> {
    const request = await this.contactRequestRepo.findOne({
      where: { request_id: requestId },
    });

    if (!request) {
      throw new NotFoundException('好友请求不存在');
    }

    if (request.status !== ContactRequestStatus.PENDING) {
      throw new BadRequestException('该请求已被处理');
    }

    request.status = ContactRequestStatus.REJECTED;
    request.responded_at = new Date();

    await this.contactRequestRepo.save(request);
  }

  //调试用 查找全部request
  async findAll(){
    return this.contactRequestRepo.find();
  }
}
