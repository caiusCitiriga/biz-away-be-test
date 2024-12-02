import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { UserTrip, UserTripsRepoService } from '@repos';
import { ITrip, TripsPlaces, TripsTypes } from '@models';

import { UserTripDto } from '../dto/user-trip.dto';
import { TripManagerService } from './trip-manager.service';
import { UserTripsServiceMock } from 'test/mocks/user-trips.service.mock';

describe('TripManagerService features', () => {
  let trips: ITrip[];
  let userSavedTrips: UserTrip[];
  let service: TripManagerService;
  let userTripsRepoService: UserTripsRepoService;

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
        TripManagerService,
        {
          provide: UserTripsRepoService,
          useValue: <UserTripsServiceMock>{
            create: () => null,
            getByUserId: () => null,
            deleteUserOwnedTrip: () => null,
          },
        },
      ],
    }).compile();

    service = module.get<TripManagerService>(TripManagerService);
    userTripsRepoService =
      module.get<UserTripsRepoService>(UserTripsRepoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a user trip', async () => {
    const userId = new Types.ObjectId().toString();
    const savedTripId = new Types.ObjectId().toString();
    const userTrip: UserTripDto = {
      userId,
      trip: trips[0],
      id: savedTripId,
    };

    jest.spyOn(userTripsRepoService, 'create').mockResolvedValue(userTrip);

    const result = await service.saveUserTrip(userId, userTrip.trip);

    expect(result).toBeDefined();
    expect(result.userId).toEqual(userId);
    expect(result.id).toEqual(savedTripId);
    expect(result.trip).toEqual(userTrip.trip);
  });

  it('should get user saved trips', async () => {
    const userId = new Types.ObjectId().toString();
    const savedTripId = new Types.ObjectId().toString();
    const userTrip: UserTripDto = {
      userId,
      trip: trips[0],
      id: savedTripId,
    };

    userSavedTrips = [userTrip];

    jest
      .spyOn(userTripsRepoService, 'getByUserId')
      .mockImplementation((userId: string) =>
        Promise.resolve(userSavedTrips.filter((t) => t.userId === userId)),
      );

    const result = await service.getUserTrips(userId);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].id).toEqual(savedTripId);
    expect(result[0].trip).toEqual(userTrip.trip);
    expect(result[0].userId).toEqual(userTrip.userId);
  });

  it('should delete a user saved trip', async () => {
    const userId = new Types.ObjectId().toString();
    const savedTripId = new Types.ObjectId().toString();
    const userTrip: UserTripDto = {
      userId,
      trip: trips[0],
      id: savedTripId,
    };

    userSavedTrips = [userTrip];

    jest
      .spyOn(userTripsRepoService, 'deleteUserOwnedTrip')
      .mockImplementation((savedTripId: string, userId: string) => {
        const deletedTrip = userSavedTrips.find(
          (t) => savedTripId === t.id && t.userId === userId,
        );
        if (!deletedTrip) return Promise.resolve(null);
        return Promise.resolve(deletedTrip);
      });

    const result = await service.deleteUserTrip(savedTripId, userId);
    expect(result).toBeDefined();
    expect(result.id).toEqual(savedTripId);
    expect(result.trip).toEqual(userTrip.trip);
    expect(result.userId).toEqual(userTrip.userId);
  });

  it('should return 404 when deleting non existing trip', async () => {
    jest
      .spyOn(userTripsRepoService, 'deleteUserOwnedTrip')
      .mockResolvedValue(null);

    expect(service.deleteUserTrip('', '')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
