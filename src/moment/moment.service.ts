import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moment, MomentVisibility } from './entities/moment.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateMomentDto } from './dto/create-moment.dto';
import { error } from 'console';
import { CreateMomentResponseDto } from './dto/create-moment-response.dto';
import { MomentResponseDto } from './dto/moment-response.dto';
import { ContactService } from 'src/contacts/contact.service';

@Injectable()
export class MomentService {
  constructor(
    @InjectRepository(Moment)
    private readonly momentRepo: Repository<Moment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly contactService: ContactService,
  ) {}

  //新建一条post
  async create(
    userId: string,
    dto: CreateMomentDto,
    files: Express.Multer.File[],
  ) {
    console.log('userId = ',userId);

    const user = await this.userRepo.findOneBy({ user_id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    console.log('查到的用户:', user);


    const baseUrl = process.env.HOST_URL || 'http://localhost:3000';

    const mediaUrls = files.map(
      (file) => `${baseUrl}/static/uploads/moments/${file.filename}`,
    );

    const moment = this.momentRepo.create({
      content: dto.content ?? null,
      media_urls: mediaUrls,
      visibility: dto.visibility ?? MomentVisibility.FRIENDS,
      user: user,
    });

    const savedMoment = await this.momentRepo.save(moment);

    const response: CreateMomentResponseDto = {
      moment_id: savedMoment.moment_id,
      content: savedMoment.content,
      media_urls: savedMoment.media_urls,
      created_at: savedMoment.created_at,
    };

    return response;
  }

  //获取当前用户所有能看见的moments
  // moment.service.ts

  async findVisibleMoments(
    currentUserId: string,
  ): Promise<MomentResponseDto[]> {
    // 获取好友 ID 列表
    const friendEntries =
      await this.contactService.getAllFriendIds(currentUserId);
    const friendIds = friendEntries.map((f) => f.friend_user_id);

    const qb = this.momentRepo
      .createQueryBuilder('moment')
      .leftJoinAndSelect('moment.user', 'user')
      .where('moment.visibility = :public', { public: 'public' })
      .orWhere('moment.user_id = :self', { self: currentUserId });

    if (friendIds.length > 0) {
      qb.orWhere(
        'moment.visibility = :friends AND moment.user_id IN (:...friendIds)',
        {
          friends: 'friends',
          friendIds,
        },
      );
    }

    const moments = await qb.orderBy('moment.created_at', 'DESC').getMany();

    return moments.map((m) => ({
      moment_id: m.moment_id,
      content: m.content,
      media_urls: m.media_urls,
      visibility: m.visibility,
      created_at: m.created_at,
      user: {
        user_id: m.user.user_id,
        display_name: m.user.display_name,
        avatar_url: m.user.avatar_url,
      },
    }));
  }

  //调试用
  //获取所有Moment
  async findAll() {
    const result: Moment[] = await this.momentRepo.find();

    return result;
  }
}
