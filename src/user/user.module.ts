import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'zzf_secret', // 替换为更安全的 secret
      signOptions: { expiresIn: '7d' },
    }),

  ],
  providers: [UserService],
  controllers: [UserController],
  exports:[UserService],
})
export class UserModule {}
