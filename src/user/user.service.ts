import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  // 加盐轮数，建议值 10 ~ 12
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 注册新用户
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, display_name, avatar_url } = createUserDto;

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
      avatar_url: avatar_url || null,
    });

    // 4. 保存到数据库
    return await this.userRepository.save(user);
  }

  /**
   * 验证用户登录（用于 JWT 策略）
   */
  async validateUser(username: string, password: string): Promise<Omit<User, 'password_hash'> | null> {
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
   * 根据用户名查找用户（可选）
   */
  async findOneByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ username });
  }

  /**
   * 根据 ID 查找用户（可选）
   */
  async findOneById(user_id: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ user_id });
  }

  /**
   * 查找所有用户
   */
  async findAll():Promise<User[]>{
    return this.userRepository.find();
  }
}