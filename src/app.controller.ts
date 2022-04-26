import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
import { Chat } from './chat/chat.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly chatService: ChatService,
  ) {}
}
