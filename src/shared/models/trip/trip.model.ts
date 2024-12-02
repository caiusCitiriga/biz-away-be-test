import { TripsTypes } from './trips-types.enum';
import { TripsPlaces } from './trips-places.enum';

export interface ITrip {
  id: string;
  cost: number;
  duration: number;
  type: TripsTypes;
  origin: TripsPlaces;
  display_name: string;
  destination: TripsPlaces;
}
