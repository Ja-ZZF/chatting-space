// src/user-special-care/dto/set-special-care.dto.ts
export class SetSpecialCareDto {
  owner_user_id: string;
  target_user_id: string;
  is_care: boolean; // true = 设置，false = 取消
}