// src/contacts/dto/contact.response.dto.ts
export class ContactResponseDto {
  contact_id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: Date;
  last_message_sent_at: Date | null;
}