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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { UpdateDisplayNameDto } from './dto/update-display-name.dto';
import { FriendUserResponseDto } from './dto/friend-user-response.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * ✅ 注册是公开接口
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

  /**
   * ✅ 获取所有用户信息（调试用，建议上线时移除或加认证）
   */
  @Get('all')
  async getAll() {
    return this.userService.findAll();
  }

  /**
   * ✅ 根据 token 中的 username 获取用户信息
   */
  @UseGuards(JwtAuthGuard)
  @Get('search-by-name')
  async searchUserByName(@Req() req: Request): Promise<UserResponseDto> {
    const username = req.user?.username; // 从 token 解码后挂载的 user 对象里取 username

    if (!username || username.trim() === '') {
      throw new HttpException('Username is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findUserByUsername(username.trim());

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  /**
   * ✅ 根据 token 中的 user_id 获取用户信息
   */
  @UseGuards(JwtAuthGuard)
  @Get('search-by-id')
  async searchUserById(@Req() req: Request): Promise<UserResponseDto> {
    const user_id = req.user?.user_id; // 从 token 解码后的 req.user 里获取 user_id

    if (!user_id || user_id.trim() === '') {
      throw new HttpException('UserId is required', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.findUserById(user_id.trim());

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
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
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('没有上传文件');
    }

    // 从验证后的 req.user 里获取 user_id
    const userId = req.user?.user_id;
    if (!userId) {
      throw new UnauthorizedException('无法获取用户信息');
    }

    const protocol = req.protocol;
    const host = req.get('host');
    const avatarUrl = `${protocol}://${host}/static/uploads/avatar/${file.filename}`;

    await this.userService.updateAvatar(userId, avatarUrl);

    return { avatarUrl };
  }

  /**
   * ✅ 关键字搜索用户（带 is_friend 字段）
   */
  @UseGuards(JwtAuthGuard)
  @Post('search-by-keyword')
  async searchUsers(
    @Body('keyword') keyword: string,
    @Req() req: Request, // 或 Request 类型，但要能访问到 user
  ): Promise<FriendUserResponseDto[]> {
    const currentUserId = req.user?.user_id; // 从 JwtAuthGuard 提取的用户信息

    if (!keyword || !currentUserId) {
      throw new BadRequestException('Keyword 或用户身份缺失');
    }

    const dto: SearchUserDto = {
      keyword,
      currentUserId,
    };

    return this.userService.searchUsersByUsername(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-display-name')
  async updateDisplayName(
    @Body('display_name') displayName: string, // 直接取 display_name 字符串
    @Req() req: Request,
  ) {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new UnauthorizedException('无法获取用户信息');
    }

    // 组装完整 DTO
    const fullDto = {
      user_id: userId,
      display_name: displayName,
    };

    try {
      return await this.userService.updateDisplayName(fullDto);
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
