import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({
    required: [true, 'Message is required'],
  })
  message: string;

  @Prop({
    required: [true, 'Sender is required'],
  })
  sender: string;

  @Prop({
    required: [true, 'Recepient is required'],
  })
  recepient: string;

  @Prop({
    required: [true, 'Time is required'],
  })
  time: Date;

  @Prop({
    required: [true, 'isRead is required'],
  })
  isRead: boolean;

  constructor(chat?: Partial<Chat>) {
    Object.assign(this, chat);
  }
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
