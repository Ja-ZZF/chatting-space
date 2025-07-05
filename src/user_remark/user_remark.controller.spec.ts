import { Test, TestingModule } from '@nestjs/testing';
import { UserRemarkController } from './user_remark.controller';

describe('UserRemarkController', () => {
  let controller: UserRemarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRemarkController],
    }).compile();

    controller = module.get<UserRemarkController>(UserRemarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
