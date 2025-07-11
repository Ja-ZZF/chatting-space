// user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ContactModule } from 'src/contacts/contact.module';
import { Moment } from 'src/moment/entities/moment.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User,Moment]), // 注册 User 实体
    ContactModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
  ],
  exports: [UserService], // 可选：如果其他模块要使用 UserService
})
export class UserModule {}