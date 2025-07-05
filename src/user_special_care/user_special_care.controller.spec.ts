import { Test, TestingModule } from '@nestjs/testing';
import { UserSpecialCareController } from './user_special_care.controller';

describe('UserSpecialCareController', () => {
  let controller: UserSpecialCareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSpecialCareController],
    }).compile();

    controller = module.get<UserSpecialCareController>(UserSpecialCareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
