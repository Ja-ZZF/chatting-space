import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { ContactRequestStatus } from '../entities/contact_request.entity';


export class ContactRequestResponseDto {
  request_id: string;
  requester_id: string;
  target_id: string;
  message?: string;
  status: ContactRequestStatus;
  created_at: Date;
  responded_at?: Date | null;

  // 发起人/接收人信息（二选一使用）
  requester?: UserResponseDto;
  target?: UserResponseDto;

  constructor(partial: Partial<ContactRequestResponseDto>) {
    Object.assign(this, partial);
  }
}
