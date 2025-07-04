export class UserResponseDto {
  user_id: string;
  username: string;
  display_name?: string | null;
  avatar_url?: string | null;
  created_at: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}