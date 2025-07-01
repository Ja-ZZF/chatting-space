export class UserResponseDto {
  user_id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  created_at: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}