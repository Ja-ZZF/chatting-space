import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  HttpException,
  Query,
  UseInterceptors,
  BadRequestException,
  Param,
  UploadedFile,
  Req,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Request } from 'express';
import { UpdateDisplayNameDto } from './dto/update-display-name.dto';
import { FriendUserResponseDto } from './dto/friend-user-response.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 注册新用户
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return {
      message: 'User created successfully',
      user: {
        user_id: user.user_id,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
    };
  }

  //获取所有用户信息（调试用）
  @Get('all')
  async getAll() {
    return this.userService.findAll();
  }

  //根据username获取信息
  @Get('search')
  async searchUser(
    @Query('username') username: string,
  ): Promise<UserResponseDto> {
    if (!username || username.trim() === '') {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findUserByUsername(username.trim());

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @Get('by-id')
  async searchUserById(
    @Query('user_id') user_id: string,
  ): Promise<UserResponseDto> {
    if (!user_id || user_id.trim() === '') {
      throw new HttpException('UserId is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findUserById(user_id.trim());

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  //上传用户头像
  @Post('upload-avatar/:userId')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './public/uploads/avatar',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new BadRequestException('只支持图片文件'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request, // 获取请求对象，用于拼接域名
  ) {
    if (!file) {
      throw new BadRequestException('没有上传文件');
    }

    // 生成绝对 URL
    const protocol = req.protocol;
    const host = req.get('host'); // 如 47.117.0.254:3000
    const avatarUrl = `${protocol}://${host}/static/uploads/avatar/${file.filename}`;

    await this.userService.updateAvatar(userId, avatarUrl);

    return { avatarUrl };
  }

  // 根据关键字查询（带 is_friend 字段）
  @Post('search-by-keyword')
  async searchUsers(
    @Body() body: SearchUserDto,
  ): Promise<FriendUserResponseDto[]> {
    //const { keyword, currentUserId } = body;
    return this.userService.searchUsersByUsername(body);
  }

  //更新显示名
  @Patch('update-display-name')
  async updateDisplayName(@Body() dto: UpdateDisplayNameDto) {
    try {
      return await this.userService.updateDisplayName(dto);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
