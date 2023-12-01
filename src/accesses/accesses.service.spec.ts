import { Test, TestingModule } from '@nestjs/testing';
import { AccessesService } from './accesses.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

describe(AccessesService.name, () => {
  let service: AccessesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule,
      ],
      providers: [AccessesService],
    }).compile();

    service = module.get<AccessesService>(AccessesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
