import { UserResponseDto } from "./user-response.dto";

export class FriendUserResponseDto extends UserResponseDto {
  is_friend: boolean;

  constructor(partial: Partial<FriendUserResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
