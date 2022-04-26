import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    ConfigModule,
    UserModule,
  ],
  controllers: [],
  providers: [ChatService, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
