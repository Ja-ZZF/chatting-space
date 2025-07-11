import { SimpleUserInfoDto } from "src/users/dto/simple-user-info.dto";

export class MomentResponseDto{
    moment_id : string;
    content : string | null;
    media_urls : string[];
    visibility : string;
    created_at : Date;
    user : SimpleUserInfoDto;
}