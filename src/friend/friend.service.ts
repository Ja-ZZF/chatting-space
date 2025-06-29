import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { CreateFriendDto } from './dto/create-friend.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private readonly friendRepo: Repository<Friend>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async addFriend(dto: CreateFriendDto) {
    const { user_id_1, user_id_2 } = dto;

    if (user_id_1 === user_id_2) {
      throw new ConflictException('不能添加自己为好友');
    }

    const user1 = await this.userRepo.findOne({ where: { user_id: user_id_1 } });
    const user2 = await this.userRepo.findOne({ where: { user_id: user_id_2 } });

    if (!user1 || !user2) {
      throw new NotFoundException('用户不存在');
    }

    const exists = await this.friendRepo.findOne({
      where: [
        { user1: { user_id: user_id_1 }, user2: { user_id: user_id_2 } },
        { user1: { user_id: user_id_2 }, user2: { user_id: user_id_1 } },
      ],
    });

    if (exists) {
      throw new ConflictException('好友关系已存在');
    }

    const friend = this.friendRepo.create({ user1, user2 });
    await this.friendRepo.save(friend);
    return { message: '好友添加成功' };
  }

  async getFriendList(userId: string) {
    const friends = await this.friendRepo
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.user1', 'user1')
      .leftJoinAndSelect('friend.user2', 'user2')
      .where('user1.user_id = :userId OR user2.user_id = :userId', { userId })
      .getMany();

    const result = friends.map(friend => {
      const isUser1 = friend.user1.user_id === userId;
      const otherUser = isUser1 ? friend.user2 : friend.user1;

      return {
        friend_id: friend.friend_id,
        created_at: friend.created_at,
        last_message_time: friend.last_message_time,
        user: {
          user_id: otherUser.user_id,
          user_name: otherUser.user_name,
          display_name: otherUser.display_name,
          avatar: otherUser.avatar,
          created_at: otherUser.created_at,
        },
      };
    });

    return result;
}


  async findOne(friendId : string){
    const friend = this.friendRepo.findOne({
      where:{friend_id:friendId}
    });
    return friend;
  }

  async findAll(){
    return this.friendRepo.find();
  }
}
