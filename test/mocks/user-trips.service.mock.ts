import { UserTripsRepoService } from '@repos';

export type UserTripsServiceMock<T = Partial<UserTripsRepoService>> = {
  [Property in keyof T]: any;
};
