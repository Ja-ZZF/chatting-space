import { Controller, Get, Query } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService : MessageService){}

    @Get('all')
    async getAll(){
        return this.messageService.findAll();
    }

    @Get('history')
    async getHistory(
    @Query('userA') userA: string,
    @Query('userB') userB: string
    ) {
    return this.messageService.getChatHistory(userA, userB);
    }



}
