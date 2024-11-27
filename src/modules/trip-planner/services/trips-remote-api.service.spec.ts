import { Test, TestingModule } from '@nestjs/testing';
import { TripsRemoteApiService } from './trips-remote-api.service';

describe('TripsRemoteApiService', () => {
  let service: TripsRemoteApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripsRemoteApiService],
    }).compile();

    service = module.get<TripsRemoteApiService>(TripsRemoteApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
