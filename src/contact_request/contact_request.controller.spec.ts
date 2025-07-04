import { Test, TestingModule } from '@nestjs/testing';
import { ContactRequestController } from './contact_request.controller';

describe('ContactRequestController', () => {
  let controller: ContactRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactRequestController],
    }).compile();

    controller = module.get<ContactRequestController>(ContactRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
