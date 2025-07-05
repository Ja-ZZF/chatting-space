// src/user-special-care/user-special-care.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSpecialCare } from './entities/user-special-care.entity';
import { Repository } from 'typeorm';
import { SetSpecialCareDto } from './dto/set-special-care.dto';
import { GetSpecialCareStatusDto } from './dto/get-special-care-status.dto';
import { SpecialCareStatusResponseDto } from './dto/special-care-status-response.dto';

@Injectable()
export class UserSpecialCareService {
  constructor(
    @InjectRepository(UserSpecialCare)
    private readonly careRepo: Repository<UserSpecialCare>,
  ) {}

  async setSpecialCare(dto: SetSpecialCareDto): Promise<void> {
    const existing = await this.careRepo.findOneBy({
      owner_user_id: dto.owner_user_id,
      target_user_id: dto.target_user_id,
    });

    if (dto.is_care) {
      if (!existing) {
        const newCare = this.careRepo.create({
          owner_user_id: dto.owner_user_id,
          target_user_id: dto.target_user_id,
        });
        await this.careRepo.save(newCare);
      }
    } else {
      if (existing) {
        await this.careRepo.remove(existing);
      }
    }
  }

  async getSpecialCareStatus(
    dto: GetSpecialCareStatusDto,
  ): Promise<SpecialCareStatusResponseDto> {
    const record = await this.careRepo.findOneBy({
      owner_user_id: dto.owner_user_id,
      target_user_id: dto.target_user_id,
    });

    return {
      is_cared: !!record,
    };
  }
}
