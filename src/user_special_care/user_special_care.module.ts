import { Module } from '@nestjs/common';
import { UserSpecialCareService } from './user_special_care.service';
import { UserSpecialCareController } from './user_special_care.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSpecialCare } from './entities/user-special-care.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserSpecialCare])],
  providers: [UserSpecialCareService],
  controllers: [UserSpecialCareController],
  exports : [UserSpecialCareService],
})
export class UserSpecialCareModule {}
