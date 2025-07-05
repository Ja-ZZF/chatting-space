import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Message } from './entities/message.entity';
import { MessageResponseDto } from './dto/message.response.dto';
import { User } from 'src/users/entities/user.entity';
import Redis from 'ioredis';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MessageService {
  private redisClient: Redis;

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();
  }
  /**
   * 根据 contact_id 获取该联系人的所有消息
   * @param contactId 联系人 ID
   */
  async getMessagesByContactId(
    contactId: string,
  ): Promise<MessageResponseDto[]> {
    const cacheKey = `messages:contact:${contactId}`;
    console.log(`[Redis] 尝试读取缓存，key=${cacheKey}`);

    const cache = await this.redisClient.get(cacheKey);
    if (cache) {
      console.log(`[Redis] 缓存命中，返回缓存数据`);
      return JSON.parse(cache);
    }

    console.log(`[Redis] 缓存未命中，查询数据库`);

    const messages = await this.messageRepository.find({
      where: { contact_id: contactId },
      relations: ['sender', 'receiver'],
      order: {
        created_at: 'ASC',
      },
    });

    const mapped = messages.map((msg) => ({
      message_id: msg.message_id,
      contact_id: msg.contact_id,
      sender_id: msg.sender_id,
      receiver_id: msg.receiver_id,
      content: msg.content,
      message_type: msg.message_type,
      created_at: msg.created_at,
      is_read: msg.is_read, // ✅ 添加 is_read 字段

      sender: {
        user_id: msg.sender.user_id,
        username: msg.sender.username,
        display_name: msg.sender.display_name,
        avatar_url: msg.sender.avatar_url,
      },

      receiver: {
        user_id: msg.receiver.user_id,
        username: msg.receiver.username,
        display_name: msg.receiver.display_name,
        avatar_url: msg.receiver.avatar_url,
      },
    }));

    // 缓存结果，设置过期时间比如300秒（5分钟）
    console.log(`[Redis] 设置缓存，key=${cacheKey}，过期时间300秒`);
    await this.redisClient.set(cacheKey, JSON.stringify(mapped), 'EX', 300);

    return mapped;
  }

  //添加发送消息
  async createMessage(data: {
    contact_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    message_type: string;
  }): Promise<MessageResponseDto> {
    const message = this.messageRepository.create(data);
    const savedMessage = await this.messageRepository.save(message);

    const [sender, receiver] = await Promise.all([
      this.userRepository.findOneBy({ user_id: data.sender_id }),
      this.userRepository.findOneBy({ user_id: data.receiver_id }),
    ]);

    if (!sender || !receiver) {
      throw new Error('Sender or Receiver not found');
    }

    // 删除对应联系人的缓存，确保下一次读取刷新
    const cacheKey = `messages:contact:${data.contact_id}`;
    await this.redisClient.del(cacheKey);

    return {
      message_id: savedMessage.message_id,
      contact_id: savedMessage.contact_id,
      sender_id: savedMessage.sender_id,
      receiver_id: savedMessage.receiver_id,
      content: savedMessage.content,
      message_type: savedMessage.message_type,
      created_at: savedMessage.created_at,
      is_read: savedMessage.is_read, // ✅ 加入 is_read 字段

      sender: {
        user_id: sender.user_id,
        username: sender.username,
        display_name: sender.display_name,
        avatar_url: sender.avatar_url,
      },

      receiver: {
        user_id: receiver.user_id,
        username: receiver.username,
        display_name: receiver.display_name,
        avatar_url: receiver.avatar_url,
      },
    };
  }

  //全部消息
  async getAll() {
    return this.messageRepository.find();
  }

  //标记已读
  async markMessagesAsRead(
    contact_id: string,
    receiver_id: string,
  ): Promise<Message[]> {
    // 先查出所有未读消息
    const unreadMessages = await this.messageRepository.find({
      where: {
        contact_id,
        receiver_id,
        is_read: false,
      },
      select: ['message_id', 'sender_id', 'contact_id'], // 只查必要字段
    });

    if (unreadMessages.length === 0) return [];

    const messageIds = unreadMessages.map((msg) => msg.message_id);

    // 批量更新为已读
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ is_read: true })
      .whereInIds(messageIds)
      .execute();

    // 更新数据库后，清理缓存
    const cacheKey = `messages:contact:${contact_id}`;
    await this.redisClient.del(cacheKey);

    return unreadMessages;
  }
}
