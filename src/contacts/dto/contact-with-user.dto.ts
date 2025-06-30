import { User } from 'src/users/entities/user.entity';

export class ContactWithUserDto {
  contact_id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: Date;
  last_message_sent_at: Date | null;

  userA: {
    user_id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };

  userB: {
    user_id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}