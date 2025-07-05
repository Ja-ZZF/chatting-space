import { Test, TestingModule } from '@nestjs/testing';
import { UserSpecialCareService } from './user_special_care.service';

describe('UserSpecialCareService', () => {
  let service: UserSpecialCareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSpecialCareService],
    }).compile();

    service = module.get<UserSpecialCareService>(UserSpecialCareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
