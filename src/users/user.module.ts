// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // 注册 User 实体
  ],
  controllers: [UserController],
  providers: [
    UserService,
  ],
  exports: [UserService], // 可选：如果其他模块要使用 UserService
})
export class UserModule {}