import { Test, TestingModule } from '@nestjs/testing';
import { TripPlannerService } from './trip-planner.service';

describe('TripPlannerService', () => {
  let service: TripPlannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripPlannerService],
    }).compile();

    service = module.get<TripPlannerService>(TripPlannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
