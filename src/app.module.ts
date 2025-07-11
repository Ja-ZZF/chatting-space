//app.module
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contacts/contact.module';
import { MessageModule } from './message/message.module';
import { UploadModule } from './upload/upload.module';
import { ContactRequestModule } from './contact_request/contact_request.module';
import { RedisModule } from './redis/redis.module';
import { UserRemarkModule } from './user_remark/user_remark.module';
import { UserSpecialCareModule } from './user_special_care/user_special_care.module';
import { ConfigModule } from '@nestjs/config';
import { MomentModule } from './moment/moment.module';

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
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用
    }),
    UserModule,
    AuthModule,
    ContactModule,
    MessageModule,
    UploadModule,
    ContactRequestModule,
    RedisModule,
    UserRemarkModule,
    UserSpecialCareModule,
    MomentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
