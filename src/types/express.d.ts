import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      user_id: string;
      username: string;
      // 你 JwtStrategy validate 返回的字段都写这里
    };
  }
}
