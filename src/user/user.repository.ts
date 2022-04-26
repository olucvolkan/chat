import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from 'src/chat/chat.entity';
import { User, UserDocument } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async save(user: User): Promise<User> {
    const userModel = new this.userModel(user);
    console.log(userModel);
    userModel.save();
    return userModel;
  }

  async update(user: User): Promise<User> {
    const userModel = new this.userModel(user);
    userModel.updateOne(user).exec();
    console.log(userModel);
    return userModel;
  }

  async findOneByUserName(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  findOneByToken(token: string): Promise<User> {
    return this.userModel.findOne({ token: token }).exec();
  }

  async findUserFriendList(token: string) {
    return await this.userModel
      .find()
      .select('friends')
      .where('token')
      .equals(token)
      .exec();
  }

  getFriendList(userNameList: string[]) {
    return this.userModel.find({ username: { $in: userNameList } }).exec();
  }
}
