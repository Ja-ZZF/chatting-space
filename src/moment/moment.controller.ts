import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MomentService } from './moment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMomentDto } from './dto/create-moment.dto';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { momentImageStorage } from 'src/upload/upload.utils';
import { MomentResponseDto } from './dto/moment-response.dto';
@Controller('moments')
export class MomentController {
  constructor(private readonly momnetService: MomentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 9, momentImageStorage))
  async createMoment(
    @Req() req: Request,
    @Body() createMomentDto: CreateMomentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new Error('参数错误');
    }

    return this.momnetService.create(userId, createMomentDto, files);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getVisibleMoments(@Req() req: Request): Promise<MomentResponseDto[]> {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new Error('参数错误');
    }
    return this.momnetService.findVisibleMoments(userId);
  }

  @Get('all')
  async getAll() {
    return this.momnetService.findAll();
  }
}
