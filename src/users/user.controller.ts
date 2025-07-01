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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

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
  async getAll(){
    return this.userService.findAll();
  }

  //根据name获取信息
  @Get('search')
  async searchUser(@Query('username') username: string): Promise<UserResponseDto> {
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
  async searchUserById(@Query('user_id') user_id : string):Promise<UserResponseDto>{
    if(!user_id || user_id.trim()===''){
      throw new HttpException("UserId is required",HttpStatus.BAD_REQUEST);
    }

      const user = await this.userService.findUserById(user_id.trim());

      if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;

  }


}