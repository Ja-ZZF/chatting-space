import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdateDisplayNameDto } from './dto/update-display-name.dto';
import { ContactService } from 'src/contacts/contact.service';
import { FriendUserResponseDto } from './dto/friend-user-response.dto';
import { SearchUserDto } from './dto/search-user.dto';

@Injectable()
export class UserService {
  // 加盐轮数，建议值 10 ~ 12
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly contactService: ContactService,
  ) {}

  /**
   * 注册新用户
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, display_name } = createUserDto;

    // 1. 检查用户名是否已存在
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // 2. 加密密码
    const password_hash = await bcrypt.hash(password, this.saltRounds);

    // 3. 创建用户实体
    const user = this.userRepository.create({
      username,
      password_hash,
      display_name: display_name || username, // 默认等于 username
    });

    // 4. 保存到数据库
    return await this.userRepository.save(user);
  }

  /**
   * 验证用户登录（用于 JWT 策略）
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password_hash'> | null> {
    // 1. 查找用户
    const user = await this.userRepository.findOneBy({ username });
    if (!user) return null;

    // 2. 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) return null;

    // 3. 返回不带密码的信息
    const { password_hash, ...result } = user;
    return result;
  }

  /**
   * 查找所有用户
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * 根据用户名查找用户（可选）
   */
  async findUserByUsername(username: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) return null;

    return new UserResponseDto({
      user_id: user.user_id,
      username: user.username,
      display_name: user.display_name || undefined,
      avatar_url: user.avatar_url || undefined,
      created_at: user.created_at,
    });
  }

  /**
   * 根据用户 ID 查找用户（可选）
   */
  async findUserById(user_id: string): Promise<UserResponseDto | null> {
    const user = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!user) return null;

    return new UserResponseDto({
      user_id: user.user_id,
      username: user.username,
      display_name: user.display_name || undefined,
      avatar_url: user.avatar_url || undefined,
      created_at: user.created_at,
    });
  }

  // 更新用户头像 URL
  async updateAvatar(userId: string, avatarUrl: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ user_id: userId });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    user.avatar_url = avatarUrl; // 假设 avatar 字段存储头像 URL
    await this.userRepository.save(user);
  }

  //根据用户名模糊查询
  // 根据 username 和 display_name 模糊查询，并合并结果去重
  async searchUsersByUsername(
    dto: SearchUserDto,
  ): Promise<FriendUserResponseDto[]> {
    const { keyword, currentUserId } = dto;

    // 并行模糊查询 username 和 display_name
    const [byUsername, byDisplayName] = await Promise.all([
      this.userRepository.find({
        where: { username: ILike(`%${keyword}%`) },
        order: { created_at: 'DESC' },
      }),
      this.userRepository.find({
        where: { display_name: ILike(`%${keyword}%`) },
        order: { created_at: 'DESC' },
      }),
    ]);

    // 合并去重
    const mergedMap = new Map<string, User>();
    [...byUsername, ...byDisplayName].forEach((user) => {
      if (user.user_id !== currentUserId) {
        mergedMap.set(user.user_id, user);
      }
    });

    const users = Array.from(mergedMap.values());

    // 获取当前用户所有好友 ID
    const friendList = await this.contactService.getAllFriendIds(currentUserId);
    const friendIdSet = new Set(friendList.map((f) => f.friend_user_id));

    // 构建返回 DTO，标记 is_friend
    return users.map(
      (user) =>
        new FriendUserResponseDto({
          user_id: user.user_id,
          username: user.username,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
          is_friend: friendIdSet.has(user.user_id),
        }),
    );
  }

  //更新用户显示名
  async updateDisplayName(
    dto: UpdateDisplayNameDto,
  ): Promise<{ success: boolean }> {
    const user = await this.userRepository.findOneBy({ user_id: dto.user_id });
    if (!user) {
      throw new Error('用户不存在');
    }

    user.display_name = dto.display_name;
    await this.userRepository.save(user);
    return { success: true };
  }
}
