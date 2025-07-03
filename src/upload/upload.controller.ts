// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('upload')
export class UploadController {
  @Post('message-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/message-images', // 存储目录
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `message-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('只支持图片文件'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 限制最大 5MB
    }),
  )
  async uploadMessageImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('没有上传文件');
    }

    const protocol = req.protocol;
    const host = req.get('host'); // 例如 47.117.0.254:3000
    const imageUrl = `${protocol}://${host}/static/uploads/message-images/${file.filename}`;

    return { imageUrl };
  }

  @Post('message-audio')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/message-audios', // 存储目录
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `audio-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log('上传文件的 mimetype:', file.mimetype);
        // 支持的音频格式
        if (!file.mimetype.match(/^audio\/(mpeg|wav|x-wav|wave|m4a|ogg|aac)$/i)) {
          return cb(new BadRequestException('只支持音频文件 (mp3, wav, wave, m4a, ogg, aac)'), false);
        }

        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 限制最大 10MB
    }),
  )
  async uploadMessageAudio(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('没有上传文件');
    }

    const protocol = req.protocol;
    const host = req.get('host'); // 例如 47.117.0.254:3000
    const audioUrl = `${protocol}://${host}/static/uploads/message-audios/${file.filename}`;

    return { audioUrl };
  }
}
