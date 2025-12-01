import { Test, TestingModule } from '@nestjs/testing';
import { KeyrockService } from './keyrock.service';

describe('KeyrockService', () => {
  let service: KeyrockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyrockService],
    }).compile();

    service = module.get<KeyrockService>(KeyrockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
