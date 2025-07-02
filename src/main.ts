//main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 设置静态资源目录
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/', // 通过 http://xxx:3000/static/xxx 访问
  });

   // ⚠️ 关键点：启用 Socket.IO 适配器
  app.useWebSocketAdapter(new IoAdapter(app)); // 👈 必须加上这行！


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
