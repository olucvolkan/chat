import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';

import { AddFriendsRequest } from './dto/request/addFriend.dto';
import { UserService } from './user.service';
import { StatusRequest } from './dto/request/status.dto';
import { UserCreateRequest } from './dto/request/userCreate.dto';
import { parseAccessToken } from '../helper/helper';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/friend')
  addFriend(@Req() request: any, @Body() addFriendsRequest: AddFriendsRequest) {
    return this.userService.addFriends(
      addFriendsRequest.username,
      addFriendsRequest.friends,
    );
  }

  @Put('/status')
  updateStatus(@Req() request: any, @Body() statusRequest: StatusRequest) {
    const accessToken = parseAccessToken(request.headers.authorization);
    return this.userService.updateStatus(accessToken, statusRequest.status);
  }

  @Post('/user')
  createUser(
    @Req() request: any,
    @Body() userCreateRequest: UserCreateRequest,
  ) {
    return this.userService.createUser(
      userCreateRequest.username,
      userCreateRequest.friends,
    );
  }
}
