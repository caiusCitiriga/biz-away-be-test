import { TripsRemoteApiService } from 'src/modules/trip-planner/services/trips-remote-api.service';

export type TripsRemoteApiServiceMock<T = Partial<TripsRemoteApiService>> = {
  [Property in keyof T]: any;
};
