import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  salt: string;

  @Prop({ type: String })
  password: string;
}

export type UserDocument = User & Document;
const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
