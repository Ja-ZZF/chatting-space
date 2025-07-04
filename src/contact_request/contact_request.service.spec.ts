import { Test, TestingModule } from '@nestjs/testing';
import { ContactRequestService } from './contact_request.service';

describe('ContactRequestService', () => {
  let service: ContactRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactRequestService],
    }).compile();

    service = module.get<ContactRequestService>(ContactRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
