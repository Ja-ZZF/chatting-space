// src/user-remark/user-remark.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { GetUserRemarkDto } from './dto/get-user-remark.dto';
import { SetUserRemarkDto } from './dto/set-user-remark.dto';
import { UserRemarkResponseDto } from './dto/user-remark-response.dto';
import { UserRemarkService } from './user_remark.service';

@Controller('user-remark')
export class UserRemarkController {
  constructor(private readonly userRemarkService: UserRemarkService) {}

  @Post('get')
  async getUserRemark(
    @Body() dto: GetUserRemarkDto,
  ): Promise<UserRemarkResponseDto | { message: string }> {
    const remark = await this.userRemarkService.getUserRemark(dto);
    if (!remark) {
      return { message: '未找到备注' };
    }
    return remark;
  }

  @Post('set')
  async setUserRemark(
    @Body() dto: SetUserRemarkDto,
  ): Promise<{ message: string }> {
    await this.userRemarkService.setUserRemark(dto);
    return { message: '备注设置成功' };
  }
}
