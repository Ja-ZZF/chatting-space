import { Timestamp } from "typeorm";

export class CreateMomentResponseDto{
    moment_id : string;
    content : string;
    media_urls : string[];
    created_at : Date;
}