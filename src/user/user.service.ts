import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async addFriends(username, friends: string[]) {
    const user = await this.userRepository.findOneByUserName(username);
    user.friends.push(...friends);
    return await this.userRepository.update(user);
  }

  async createUser(username: string, friends: string[]) {
    const user = await this.userRepository.findOneByUserName(username);
    if (user) {
      return user;
    }
    const token = randomUUID();
    return await this.userRepository.save({
      username,
      status: 'online',
      friends: friends,
      token,
      socketId: null,
    });
  }

  async updateStatus(accessToken, status: string) {
    const user = await this.userRepository.findOneByToken(accessToken);
    user.status = status;
    return await this.userRepository.update(user);
  }

  async getFriendsList(userNameList: string[]): Promise<User[]> {
    return this.userRepository.getFriendList(userNameList);
  }

  findByToken(token: string): Promise<User> {
    return this.userRepository.findOneByToken(token);
  }

  async updateConnectedSocketId(
    token: string,
    socketId: string,
    status: string,
  ) {
    const user = await this.userRepository.findOneByToken(token);
    user.socketId = socketId;
    user.status = status;
    return await this.userRepository.update(user);
  }
}
