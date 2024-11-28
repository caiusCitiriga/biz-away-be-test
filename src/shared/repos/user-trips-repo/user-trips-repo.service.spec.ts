import { Test, TestingModule } from '@nestjs/testing';
import { UserTripsRepoService } from './user-trips-repo.service';

describe('UsersRepoService', () => {
  let service: UserTripsRepoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTripsRepoService],
    }).compile();

    service = module.get<UserTripsRepoService>(UserTripsRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
