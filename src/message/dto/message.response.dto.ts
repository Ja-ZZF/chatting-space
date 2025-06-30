// src/messages/dto/message.response.dto.ts
export class MessageResponseDto {
  message_id: string;
  contact_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: string;
  created_at: Date;

  // 可选：发送者和接收者的部分信息
  sender?: {
    user_id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };

  receiver?: {
    user_id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}