import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import { AddressInfo } from 'net';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user/user.service';
import { UserRepository } from './user/user.repository';
import { User } from './user/user.entity';
import { createMockUser } from './mock';

describe('my awesome project', () => {
  let io, serverSocket, clientSocket;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn().mockReturnValue(createMockUser()),
          },
        },
      ],
    }).compile();
  });

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const { port } = httpServer.address() as AddressInfo;
      clientSocket = Client(`http://localhost:${port}`);
      io.on('connection', (socket) => {
        socket.headers.headers.authorization = 'Bearer';
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('send message', (done) => {
    clientSocket.on('messages', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    serverSocket.emit('hello', 'world');
  });

  test('should work (with ack)', (done) => {
    serverSocket.on('hi', (cb) => {
      cb('hola');
    });
    clientSocket.emit('hi', (arg) => {
      expect(arg).toBe('hola');
      done();
    });
  });
});
