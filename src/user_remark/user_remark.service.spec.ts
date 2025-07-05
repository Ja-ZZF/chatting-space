import { Test, TestingModule } from '@nestjs/testing';
import { UserRemarkService } from './user_remark.service';

describe('UserRemarkService', () => {
  let service: UserRemarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRemarkService],
    }).compile();

    service = module.get<UserRemarkService>(UserRemarkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
