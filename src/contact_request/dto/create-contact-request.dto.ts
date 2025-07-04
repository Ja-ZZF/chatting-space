export class CreateContactRequestDto {
  requester_id: string;
  target_id: string;
  message?: string; // 可选验证消息
}
