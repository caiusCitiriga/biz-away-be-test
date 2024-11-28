import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { ITrip, TripsPlaces, TripsTypes } from '@models';

@Schema({ _id: false, versionKey: false })
export class EmbeddedTrip implements ITrip {
  @Prop({ type: String })
  id: string;

  @Prop({ type: Number })
  cost: number;

  @Prop({ type: Number })
  duration: number;

  @Prop({ enum: TripsTypes })
  type: TripsTypes;

  @Prop({ enum: TripsPlaces })
  origin: TripsPlaces;

  @Prop({ type: String })
  display_name: string;

  @Prop({ enum: TripsPlaces })
  destination: TripsPlaces;
}

@Schema()
export class UserTrip {
  @Prop({ type: String, index: true })
  id: string;

  @Prop({ type: String, index: true })
  userId: string;

  @Prop({ type: EmbeddedTrip })
  trip: ITrip;
}

export type UserTripDocument = UserTrip & Document;
const UserTripSchema = SchemaFactory.createForClass(UserTrip);

export { UserTripSchema };
