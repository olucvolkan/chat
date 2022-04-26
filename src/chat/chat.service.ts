import { Injectable } from '@nestjs/common';
import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { USER_STATUS_ONLINE } from '../user/constants/user';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userService: UserService,
  ) {}

  async getChats() {
    return [await this.chatRepository.findAll()];
  }

  async save(message, sender: User) {
    for (const friend of sender.friends) {
      const chat = new Chat();
      chat.sender = sender.username;
      chat.recepient = friend;
      chat.time = new Date();
      chat.isRead = false;
      chat.message = message.data;
      await this.chatRepository.save(chat);
    }
  }

  async getAllUnReadMessage(user: User): Promise<Chat[]> {
    return this.chatRepository.findAllUnReadMessageByUser(user, false);
  }

  async getAllMessages(user: User): Promise<Chat[]> {
    const messageList = [];
    if (user.status === USER_STATUS_ONLINE) {
      const allUnReadMessage = await this.getAllUnReadMessage(user);
      messageList.push(...allUnReadMessage);
    }
    const allReadMessages = await this.getAllReadMessage(user);
    messageList.push(...allReadMessages);
    this.markAsReadForUnReadMessage(messageList);
    return messageList;
  }

  async getAllReadMessage(user: User): Promise<Chat[]> {
    return this.chatRepository.findAllUnReadMessageByUser(user, true);
  }

  private markAsReadForUnReadMessage(allUnReadMessage: Chat[]) {
    allUnReadMessage.forEach((message) => {
      message.isRead = true;
      this.chatRepository.save(message);
    });
  }
}
