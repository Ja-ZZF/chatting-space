import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { access_token, expires_in, refresh_token, refresh_expires_in } =
      await this.authService.login(user);

    return {
      message: 'Login successful',
      access_token,
      expires_in, // access token 过期时间，秒
      refresh_token, // 新增：refresh token
      refresh_expires_in, // 新增：refresh token 过期时间，秒
      user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
