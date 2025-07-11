import { Test, TestingModule } from '@nestjs/testing';
import { MomentController } from './moment.controller';

describe('MomentController', () => {
  let controller: MomentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MomentController],
    }).compile();

    controller = module.get<MomentController>(MomentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
