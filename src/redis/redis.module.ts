import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global() // 标记为全局模块，导入一次全局生效
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
