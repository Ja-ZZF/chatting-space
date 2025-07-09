import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.validateUser(username, password);
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.user_id,
    };

    const expiresIn = 60 * 60 * 24; // 1天，单位：秒

    return {
      access_token: this.jwtService.sign(payload),
      expires_in: expiresIn,
    };
  }
}
