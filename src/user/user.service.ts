import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async findAll():Promise<User[]>{
    const users = this.userRepo.find();
    return users;
  }

  async register(dto: RegisterUserDto) {
    const { user_name, password, display_name } = dto;

    const exists = await this.userRepo.findOne({ where: { user_name } });
    if (exists) throw new ConflictException('用户名已存在');

    const password_hash = await bcrypt.hash(password, 10);
    const user = this.userRepo.create({ user_name, password_hash, display_name });
    await this.userRepo.save(user);

    return { message: '注册成功' };
  }

  async login(dto: LoginUserDto) {
    const { user_name, password } = dto;

    const user = await this.userRepo.findOne({ where: { user_name } });
    if (!user) throw new UnauthorizedException('用户不存在');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException('密码错误');

    const payload = { sub: user.user_id, user_name: user.user_name };
    const token = this.jwtService.sign(payload);

    return { token, user_id: user.user_id };
  }
}
