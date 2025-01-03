import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TripPlannerService } from './trip-planner.service';

import { ITrip, TripsPlaces, TripsTypes } from '@models';

import { SortModes } from '../enum/sort-modes.enum';
import { TripsRemoteApiService } from './trips-remote-api.service';
import { TripsRemoteApiServiceMock } from 'test/mocks/trips-remote-api.service.mock';

describe('TripPlannerService features', () => {
  let trips: ITrip[];
  let service: TripPlannerService;
  let remoteApiService: TripsRemoteApiService;

  beforeEach(async () => {
    trips = [
      {
        origin: TripsPlaces.ATL,
        destination: TripsPlaces.LAX,
        cost: 2806,
        duration: 13,
        type: TripsTypes.car,
        id: '4c05a4eb-5fbd-42a5-a58c-6c23ce1d3438',
        display_name: 'from ATL to LAX by car',
      },
      {
        origin: TripsPlaces.ATL,
        destination: TripsPlaces.LAX,
        cost: 6542,
        duration: 6,
        type: TripsTypes.train,
        id: '8bdb00be-9706-481d-80e7-7634dc438b25',
        display_name: 'from ATL to LAX by train',
      },
      {
        origin: TripsPlaces.ATL,
        destination: TripsPlaces.LAX,
        cost: 4332,
        duration: 37,
        type: TripsTypes.train,
        id: 'e5f03cba-25ec-4486-8877-a3ef63ea65c0',
        display_name: 'from ATL to LAX by train',
      },
      {
        origin: TripsPlaces.ATL,
        destination: TripsPlaces.LAX,
        cost: 2651,
        duration: 31,
        type: TripsTypes.train,
        id: 'b2e25243-8863-4fc5-b665-0da51c313367',
        display_name: 'from ATL to LAX by train',
      },
      {
        origin: TripsPlaces.ATL,
        destination: TripsPlaces.LAX,
        cost: 5351,
        duration: 4,
        type: TripsTypes.flight,
        id: '9d229cdc-906b-4fcc-b6d0-f672e8581376',
        display_name: 'from ATL to LAX by flight',
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripPlannerService,
        {
          provide: TripsRemoteApiService,
          useValue: <TripsRemoteApiServiceMock>{
            getTrips: () => null,
          },
        },
      ],
    }).compile();

    service = module.get<TripPlannerService>(TripPlannerService);
    remoteApiService = module.get<TripsRemoteApiService>(TripsRemoteApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sort trips by: fastest', async () => {
    const result = service.sortTrips(trips, SortModes.fastest);
    expect(result).toBeDefined();
    expect(result[0].duration).toBe(4);
    expect(result[1].duration).toBe(6);
    expect(result[2].duration).toBe(13);
    expect(result[3].duration).toBe(31);
    expect(result[4].duration).toBe(37);
  });

  it('should sort trips by: cheapest', async () => {
    const result = service.sortTrips(trips, SortModes.cheapest);
    expect(result).toBeDefined();
    expect(result[0].cost).toBe(2651);
    expect(result[1].cost).toBe(2806);
    expect(result[2].cost).toBe(4332);
    expect(result[3].cost).toBe(5351);
    expect(result[4].cost).toBe(6542);
  });

  it('should fetch and sort trips by: cheapest', async () => {
    jest.spyOn(remoteApiService, 'getTrips').mockResolvedValue(trips);

    const result = await service.getSortedTrips(
      TripsPlaces.ATL,
      TripsPlaces.LAX,
      SortModes.cheapest,
    );

    expect(result).toBeDefined();
    expect(result[0].cost).toBe(2651);
    expect(result[1].cost).toBe(2806);
    expect(result[2].cost).toBe(4332);
    expect(result[3].cost).toBe(5351);
    expect(result[4].cost).toBe(6542);
  });

  it('should fetch and sort trips by: fastest', async () => {
    jest.spyOn(remoteApiService, 'getTrips').mockResolvedValue(trips);

    const result = await service.getSortedTrips(
      TripsPlaces.ATL,
      TripsPlaces.LAX,
      SortModes.fastest,
    );

    expect(result).toBeDefined();
    expect(result[0].duration).toBe(4);
    expect(result[1].duration).toBe(6);
    expect(result[2].duration).toBe(13);
    expect(result[3].duration).toBe(31);
    expect(result[4].duration).toBe(37);
  });

  it('should handle remote api fetch error gracefully', async () => {
    jest
      .spyOn(remoteApiService, 'getTrips')
      .mockRejectedValue(new BadGatewayException());

    expect(
      service.getSortedTrips(
        TripsPlaces.ATL,
        TripsPlaces.LAX,
        SortModes.cheapest,
      ),
    ).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('should handle remote api fetch unknown error gracefully', async () => {
    jest.spyOn(remoteApiService, 'getTrips').mockRejectedValue(new Error());

    expect(
      service.getSortedTrips(
        TripsPlaces.ATL,
        TripsPlaces.LAX,
        SortModes.cheapest,
      ),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
