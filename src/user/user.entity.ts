import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: [true, 'username is required'],
  })
  username: string;

  @Prop({
    required: [true, 'status is required'],
  })
  status: string;

  @Prop({
    required: [false, 'Friends is optional'],
  })
  friends: string[];

  @Prop({
    required: [false, 'token is optional'],
  })
  token: string;

  @Prop({
    required: [false, 'socketId is optional'],
  })
  socketId: null | string;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
export const UserSchema = SchemaFactory.createForClass(User);
