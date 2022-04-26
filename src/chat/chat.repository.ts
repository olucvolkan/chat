import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from 'src/chat/chat.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ChatRepository {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async save(chat: Chat): Promise<Chat> {
    const chatModel = new this.chatModel(chat);
    chatModel.save();
    return chatModel;
  }

  async findAll(): Promise<Chat[]> {
    return this.chatModel.find().exec();
  }

  findAllUnReadMessageByUser(
    recipient: User,
    isRead: boolean,
  ): Promise<Chat[]> {
    return this.chatModel
      .find()
      .where('recipient')
      .equals(recipient.username)
      .where('isRead', isRead)
      .exec();
  }
}
