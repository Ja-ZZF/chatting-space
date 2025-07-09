// src/user-remark/user-remark.controller.ts

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetUserRemarkDto } from './dto/get-user-remark.dto';
import { SetUserRemarkDto } from './dto/set-user-remark.dto';
import { UserRemarkResponseDto } from './dto/user-remark-response.dto';
import { UserRemarkService } from './user_remark.service';
import { removeRemarkDto } from './dto/remove-remark.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user-remark')
export class UserRemarkController {
  constructor(private readonly userRemarkService: UserRemarkService) {}

  @UseGuards(JwtAuthGuard)
  @Post('get')
  async getUserRemark(
    @Req() req: Request,
    @Body() body: { target_user_id: string },
  ): Promise<UserRemarkResponseDto | { message: string }> {
    const owner_user_id = req.user?.user_id;
    const { target_user_id } = body;

    if (!owner_user_id || !target_user_id) {
      throw new BadRequestException('缺少用户ID');
    }

    const dto: GetUserRemarkDto = {
      owner_user_id,
      target_user_id,
    };

    const remark = await this.userRemarkService.getUserRemark(dto);
    if (!remark) {
      return { message: '未找到备注' };
    }
    return remark;
  }

  @UseGuards(JwtAuthGuard)
  @Post('set')
  async setUserRemark(
    @Req() req: Request,
    @Body() body: { target_user_id: string; remark: string },
  ): Promise<{ message: string }> {
    const owner_user_id = req.user?.user_id;
    const { target_user_id, remark } = body;

    if (!owner_user_id || !target_user_id || !remark) {
      throw new BadRequestException('缺少必要参数');
    }

    const dto: SetUserRemarkDto = {
      owner_user_id,
      target_user_id,
      remark,
    };

    await this.userRemarkService.setUserRemark(dto);
    return { message: '备注设置成功' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('remove')
  async removeUserRemark(@Body() body: removeRemarkDto) {
    const { remark_id } = body;
    console.log('remark_id = ', remark_id);
    await this.userRemarkService.removeUserRemark(remark_id);
  }

  @Get('all')
  async getAll() {
    return this.userRemarkService.findAll();
  }
}
