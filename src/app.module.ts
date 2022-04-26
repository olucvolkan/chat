import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: `mongodb://${config.get<string>('DB_USER')}:${encodeURIComponent(
          config.get<string>('DB_PASS'),
        )}@${config.get<string>('DB_HOST')}:${config.get<string>(
          'DB_PORT',
        )}?ssl=${config.get<string>('DB_SSL')}${config.get<string>(
          'DB_PARAMETERS',
        )}`,
        dbName: config.get<string>('DB_NAME'),
      }),
    }),
    ChatModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
