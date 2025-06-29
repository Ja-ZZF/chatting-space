import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get()
  getAll(){
    return this.friendService.findAll();
  }

  @Post('add')
  add(@Body() dto: CreateFriendDto) {
    return this.friendService.addFriend(dto);
  }

  @Get('list')
  getList(@Query('user_id') userId: string) {
    return this.friendService.getFriendList(userId);
  }
}
