import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import {
  USER_STATUS_OFFLINE,
  USER_STATUS_ONLINE,
} from '../user/constants/user';
import { parseAccessToken } from '../helper/helper';

@WebSocketGateway({
  port: 4000,
  transports: ['websocket'],
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) {}

  private logger: Logger = new Logger('AppGateway');
  @SubscribeMessage('message')
  async handleEvent(@MessageBody() message, @ConnectedSocket() client: Socket) {
    const accessToken = parseAccessToken(client.request.headers.authorization);
    this.logger.log(`message ${message.data}`);
    const user = await this.userService.findByToken(accessToken);
    await this.chatService.save(message, user);
    const friendsList = await this.userService.getFriendsList(user.friends);
    for (const friend of friendsList) {
      const allMessages = await this.chatService.getAllMessages(friend);
      const friendSocket = this.server.sockets.sockets.get(friend.socketId);
      if (friendSocket) {
        this.server.sockets.sockets.get(friend.socketId).emit('allMessages', {
          allMessages: allMessages,
        });
      }
    }
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    const accessToken = parseAccessToken(client.request.headers.authorization);
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = await this.userService.updateConnectedSocketId(
      accessToken,
      client.id,
      USER_STATUS_OFFLINE,
    );
    const friendsList = await this.userService.getFriendsList(user.friends);
    friendsList.forEach((friend) => {
      if (user.friends.find((username) => username === friend.username)) {
        const friendSocket = this.server.sockets.sockets.get(friend.socketId);
        if (friendSocket) {
          this.server.sockets.sockets
            .get(friend.socketId)
            .emit('onlineUserEvent', {
              username: user.username,
              status: USER_STATUS_OFFLINE,
            });
        }
      }
    });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      const accessToken = parseAccessToken(
        client.request.headers.authorization,
      );
      this.logger.log(`Client auth: ${accessToken}`);
      const user = await this.userService.updateConnectedSocketId(
        accessToken,
        client.id,
        USER_STATUS_ONLINE,
      );

      const friendsList = await this.userService.getFriendsList(user.friends);
      friendsList.forEach((friend) => {
        if (user.friends.find((username) => username === friend.username)) {
          const friendSocket = this.server.sockets.sockets.get(friend.socketId);
          if (friendSocket) {
            this.server.sockets.sockets
              .get(friend.socketId)
              .emit('onlineUserEvent', {
                username: user.username,
                status: USER_STATUS_ONLINE,
              });
          }
        }
      });
    } catch (error) {
      client.disconnect(true);
      this.logger.log(`[ERROR]Client disconnected: ${client.id}`);
      this.logger.log(`[ERROR]Client disconnected: ${error}`);
    }
  }
}
