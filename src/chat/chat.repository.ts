import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from 'src/chat/chat.entity';

@Injectable()
export class ChatRepository {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async create(report: Chat): Promise<Chat> {
    const chatModel = new this.chatModel(report);
    chatModel.save();
    return chatModel;
  }

  async getByUserId(userId: number): Promise<Chat[]> {
    return this.chatModel.find({
      userId,
    });
  }
}
