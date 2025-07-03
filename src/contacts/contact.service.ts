// src/contacts/services/contact.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { ContactResponseDto } from './dto/response-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactWithUserDto } from './dto/contact-with-user.dto';
import { ContactWithOtherUserDto } from './dto/contact-with-other-user.dto';
import { LatestMessageView } from 'src/message/entities/latest-message-view.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
     @InjectRepository(LatestMessageView)
    private readonly latestMessageViewRepository: Repository<LatestMessageView>, // 注入视图仓库
  ) {}

  async findAllByUserId(userId: string): Promise<ContactWithOtherUserDto[]> {
      const contacts = await this.contactRepository.createQueryBuilder('contact')
        .leftJoinAndSelect('contact.userA', 'userA')
        .leftJoinAndSelect('contact.userB', 'userB')
        .where('contact.user_a_id = :userId OR contact.user_b_id = :userId', { userId })
        .orderBy('contact.last_message_sent_at', 'DESC')
        .getMany();

      return Promise.all(contacts.map(async c => {
        const isUserA = c.userA.user_id === userId;
        const otherUser = isUserA ? c.userB : c.userA;

        // 获取最后一条消息内容
        const lastMessage = await this.latestMessageViewRepository.findOneBy({
          contact_id: c.contact_id,
        });

        return {
          contact_id: c.contact_id,
          created_at: c.created_at,
          last_message_sent_at: c.last_message_sent_at,

          otherUser: {
            user_id: otherUser.user_id,
            username: otherUser.username,
            display_name: otherUser.display_name,
            avatar_url: otherUser.avatar_url,
          },

          // ✅ 我的未读消息数
          unreadCount: isUserA ? c.user_a_unread : c.user_b_unread,

          // ✅ 最后一条消息内容
          lastMessageContent: (() => {
            if (!lastMessage) return null;
            if (lastMessage.message_type === 'text') return lastMessage.content;
            if (lastMessage.message_type === 'image') return '[图片]';
            return null;
          })(),
        };
      }));
  }

  async findOne(contactId: string): Promise<ContactResponseDto> {
    const contact = await this.contactRepository.findOneBy({ contact_id: contactId });
    if (!contact) throw new Error('Contact not found');

    return {
      contact_id: contact.contact_id,
      user_a_id: contact.user_a_id,
      user_b_id: contact.user_b_id,
      created_at: contact.created_at,
      last_message_sent_at: contact.last_message_sent_at,
    };
  }

  async create(createContactDto: CreateContactDto): Promise<ContactResponseDto> {
    console.log(createContactDto);

    const { userAId, userBId } = createContactDto;

    console.log(userAId);
    console.log(userBId);

    // Check if a contact already exists between these two users
    const existingContact = await this.contactRepository.findOne({
      where: [
        { user_a_id: userAId, user_b_id: userBId },
        { user_a_id: userBId, user_b_id: userAId }
      ]
    });

    if (existingContact) {
      throw new ConflictException('Contact already exists');
    }

    const newContact = await this.contactRepository.create({
      user_a_id: userAId,
      user_b_id: userBId,
    });

    await this.contactRepository.save(newContact);

    return {
      contact_id: newContact.contact_id,
      user_a_id: newContact.user_a_id,
      user_b_id: newContact.user_b_id,
      created_at: newContact.created_at,
      last_message_sent_at: newContact.last_message_sent_at,
    };
  }

  async delete(contactId: string): Promise<void> {
    const result = await this.contactRepository.delete({ contact_id: contactId });
    if (result.affected === 0) {
      throw new Error('Contact not found');
    }
  }

  // 👇 新增的方法：重置未读数
  async clearUnreadForUser(userId: string, contactId: string): Promise<void> {
    const contact = await this.contactRepository.findOneBy({ contact_id: contactId });

    if (!contact) {
      throw new Error('联系人不存在');
    }

    // 判断当前用户是 userA 还是 userB
    if (contact.user_a_id === userId) {
      contact.user_a_unread = 0;
    } else if (contact.user_b_id === userId) {
      contact.user_b_unread = 0;
    } else {
      throw new Error('用户不在该联系人中');
    }

    // 保存更新后的 contact
    await this.contactRepository.save(contact);
  }
  
}