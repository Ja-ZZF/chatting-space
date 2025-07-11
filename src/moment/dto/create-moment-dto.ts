import { MomentVisibility } from "../entities/moment.entity";

export class CreateMomentDto{
    content : string;
    media_urls? : string[];
    visibility? : MomentVisibility;
}