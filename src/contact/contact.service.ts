// src/contacts/services/contact.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { ContactResponseDto } from './dto/response-contact.dto';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async findAllByUserId(userId: string): Promise<ContactResponseDto[]> {
    const contacts = await this.contactRepository
      .createQueryBuilder('contact')
      .where('contact.user_a_id = :userId OR contact.user_b_id = :userId', { userId })
      .orderBy('contact.last_message_sent_at', 'DESC')
      .getMany();

    return contacts.map(c => ({
      contact_id: c.contact_id,
      user_a_id: c.user_a_id,
      user_b_id: c.user_b_id,
      created_at: c.created_at,
      last_message_sent_at: c.last_message_sent_at,
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
}