// src/user-special-care/user-special-care.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { SetSpecialCareDto } from './dto/set-special-care.dto';
import { GetSpecialCareStatusDto } from './dto/get-special-care-status.dto';
import { SpecialCareStatusResponseDto } from './dto/special-care-status-response.dto';
import { UserSpecialCareService } from './user_special_care.service';

@Controller('user-special-care')
export class UserSpecialCareController {
  constructor(private readonly specialCareService: UserSpecialCareService) {}

  @Post('set')
  async setCare(@Body() dto: SetSpecialCareDto): Promise<{ message: string }> {
    await this.specialCareService.setSpecialCare(dto);
    return { message: dto.is_care ? '已设置特别关心' : '已取消特别关心' };
  }

  @Post('status')
  async getStatus(
    @Body() dto: GetSpecialCareStatusDto,
  ): Promise<SpecialCareStatusResponseDto> {
    return this.specialCareService.getSpecialCareStatus(dto);
  }
}
