export class CreateUserDto {
  username: string;
  password: string;
  display_name?: string;
  avatar_url?: string;
}