import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRemark } from './entities/user_remark.entity';
import { In, Repository } from 'typeorm';
import { GetUserRemarkDto } from './dto/get-user-remark.dto';
import { UserRemarkResponseDto } from './dto/user-remark-response.dto';
import { SetUserRemarkDto } from './dto/set-user-remark.dto';

@Injectable()
export class UserRemarkService {
  constructor(
    @InjectRepository(UserRemark)
    private readonly remarkRepository: Repository<UserRemark>,
  ) {}

  async getUserRemark(
    dto: GetUserRemarkDto,
  ): Promise<UserRemarkResponseDto | null> {
    const remark = await this.remarkRepository.findOneBy({
      owner_user_id: dto.owner_user_id,
      target_user_id: dto.target_user_id,
    });

    if (!remark) return null;

    return {
      remark_id: remark.remark_id,
      owner_user_id: remark.owner_user_id,
      target_user_id: remark.target_user_id,
      remark: remark.remark,
      updated_at: remark.updated_at,
    };
  }

  async setUserRemark(dto: SetUserRemarkDto): Promise<void> {
    const existing = await this.remarkRepository.findOneBy({
      owner_user_id: dto.owner_user_id,
      target_user_id: dto.target_user_id,
    });

    if (existing) {
      existing.remark = dto.remark;
      existing.updated_at = new Date();
      await this.remarkRepository.save(existing);
    } else {
      const newRemark = this.remarkRepository.create({
        owner_user_id: dto.owner_user_id,
        target_user_id: dto.target_user_id,
        remark: dto.remark,
      });
      await this.remarkRepository.save(newRemark);
    }
  }

  async getUserRemarksBatch(
    ownerUserId: string,
    targetUserIds: string[],
  ): Promise<Map<string, string>> {
    if (targetUserIds.length === 0) return new Map();

    const remarks = await this.remarkRepository.find({
      where: {
        owner_user_id: ownerUserId,
        target_user_id: In(targetUserIds),
      },
    });

    // 转成 Map<target_user_id, remark>
    const remarkMap = new Map<string, string>();
    for (const r of remarks) {
      remarkMap.set(r.target_user_id, r.remark);
    }
    return remarkMap;
  }

  async removeUserRemark(remark_id: string): Promise<void> {
    if (!remark_id) {
      return;
    }

    try {
      await this.remarkRepository.delete({ remark_id });
    } catch (error) {
      // 可选：日志记录
      throw new Error(
        `Failed to delete remark with id ${remark_id}: ${error.message}`,
      );
    }
  }

  async findAll() {
    return this.remarkRepository.find();
  }
}
