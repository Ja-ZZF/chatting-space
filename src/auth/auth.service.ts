import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    // access token 过期时间 1天（秒）
    const accessTokenExpiresIn = 24 * 60 * 60;

    // refresh token 过期时间 7天（秒）
    const refreshTokenExpiresIn = 7 * 24 * 60 * 60;

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: accessTokenExpiresIn,
        secret: process.env.JWT_SECRET,
      }),
      expires_in: accessTokenExpiresIn,
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: refreshTokenExpiresIn,
        secret: process.env.JWT_REFRESH_SECRET,
      }),
      refresh_expires_in: refreshTokenExpiresIn,
    };
  }

  // 刷新token，传入refreshToken，验证后返回新accessToken和refreshToken
  async refreshToken(refreshToken: string) {
    try {
      // 验证 refresh token，注意使用专门的 refresh secret
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // 这里你可以根据 payload.sub (user_id) 查询用户是否存在或状态是否有效

      const newPayload = {
        username: payload.username,
        sub: payload.sub,
      };

      const accessTokenExpiresIn = 24 * 60 * 60; // 1天
      const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7天

      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: accessTokenExpiresIn,
        secret: process.env.JWT_SECRET,
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: refreshTokenExpiresIn,
        secret: process.env.JWT_REFRESH_SECRET,
      });

      return {
        access_token: newAccessToken,
        expires_in: accessTokenExpiresIn,
        refresh_token: newRefreshToken,
        refresh_expires_in: refreshTokenExpiresIn,
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
