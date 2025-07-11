import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moment, MomentVisibility } from './entities/moment.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateMomentDto } from './dto/create-moment-dto';
import { error } from 'console';
import { CreateMomentResponseDto } from './dto/create-moment-response.dto';

@Injectable()
export class MomentService {
  constructor(
    @InjectRepository(Moment)
    private readonly momentRepo: Repository<Moment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  //新建一条post
  async create(userId: string, dto: CreateMomentDto,files : Express.Multer.File[]) {
    const user = await this.userRepo.findOneBy({ user_id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    const baseUrl = process.env.HOST_URL || 'http://localhost:3000';

    const mediaUrls = files.map(
        file =>`${baseUrl}/static/uploads/moments/${file.filename}`,
    )

    const moment = this.momentRepo.create({
      content: dto.content ?? null,
      media_urls: mediaUrls,
      visibility: dto.visibility ?? MomentVisibility.FRIENDS,
      user: user,
    });

    const savedMoment =  await this.momentRepo.save(moment);

    const response : CreateMomentResponseDto = {
        moment_id : savedMoment.moment_id,
        content : savedMoment.content,
        media_urls : savedMoment.media_urls,
        created_at : savedMoment.created_at,
    }

    return response;
  }
  
  //调试用
  //获取所有Moment
  async findAll(){
    const result : Moment[] = await this.momentRepo.find();

    return result;
  }
}
