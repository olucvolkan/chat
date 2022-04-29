import { Injectable } from '@nestjs/common';
import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { USER_STATUS_ONLINE } from '../user/constants/user';
import { Server } from 'socket.io';

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
      chat.recipient = friend;
      chat.time = new Date();
      chat.isRead = false;
      chat.message = message.data;
      await this.chatRepository.save(chat);
    }
  }

  async getAllUnReadMessage(recipient: User): Promise<Chat[]> {
    return this.chatRepository.findAllMessageByReadStatus(recipient, false);
  }

  async getAllMessages(recipient: User): Promise<Chat[]> {
    const messageList = [];
    if (recipient.status === USER_STATUS_ONLINE) {
      const allUnReadMessage = await this.getAllUnReadMessage(recipient);
      messageList.push(...allUnReadMessage);
    }
    const allReadMessages = await this.getAllReadMessage(recipient);
    messageList.push(...allReadMessages);
    this.markAsReadForUnReadMessage(messageList);
    return messageList;
  }

  async getAllReadMessage(recipient: User): Promise<Chat[]> {
    return this.chatRepository.findAllMessageByReadStatus(recipient, true);
  }

  private markAsReadForUnReadMessage(allUnReadMessage: Chat[]) {
    allUnReadMessage.forEach((message) => {
      message.isRead = true;
      this.chatRepository.save(message);
    });
  }

  async sendEventFriends(
    server: Server,
    user: User,
    eventKey: string,
    args: any,
  ) {
    const friendsList = await this.userService.getFriendsList(user.friends);
    for (const friend of friendsList) {
      const allMessages = await this.getAllMessages(friend);
      const friendSocket = server.sockets.sockets.get(friend.socketId);
      if (friendSocket) {
        server.sockets.sockets.get(friend.socketId).emit(eventKey, args);
      }
    }
  }

  async sendMessageEventFriends(server: Server, user: User, eventKey: string) {
    const friendsList = await this.userService.getFriendsList(user.friends);
    for (const friend of friendsList) {
      const allMessages = await this.getAllMessages(friend);
      const friendSocket = server.sockets.sockets.get(friend.socketId);
      if (friendSocket) {
        server.sockets.sockets.get(friend.socketId).emit(eventKey, {
          allMessages: allMessages,
        });
      }
    }
  }
}
