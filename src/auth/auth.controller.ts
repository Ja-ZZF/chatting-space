import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body('username') username: string, @Body('password') password: string) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const { access_token } = await this.authService.login(user);
    return {
      message: 'Login successful',
      access_token,
      user,
    };
  }
}