import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { FriendModule } from './friend/friend.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '47.117.0.254',
      port: 5432,
      username: 'zzf',
      password: 'zhuzi_fan12321',
      database: 'chatting_space',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // 开发用，生产环境建议关闭
    }),
    UserModule,
    FriendModule,
    MessageModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
