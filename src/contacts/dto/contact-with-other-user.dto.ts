export class ContactWithOtherUserDto {
  contact_id: string;
  created_at: Date;
  last_message_sent_at: Date | null;

  otherUser: {
    user_id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}