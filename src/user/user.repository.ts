import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async save(user: User): Promise<User> {
    const userModel = new this.userModel(user);
    userModel.save();
    return userModel;
  }

  async update(user: User): Promise<User> {
    const userModel = new this.userModel(user);
    userModel.updateOne(user).exec();
    return userModel;
  }

  async findOneByUserName(username: string): Promise<User> {
    return this.userModel.findOne({ username: username }).exec();
  }

  findOneByToken(token: string): Promise<User> {
    return this.userModel.findOne({ token: token }).exec();
  }

  getFriendList(userNameList: string[]) {
    return this.userModel.find({ username: { $in: userNameList } }).exec();
  }
}
