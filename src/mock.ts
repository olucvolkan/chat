import { User } from './user/user.entity';
import { randomUUID } from 'crypto';

export const createMockUser = (): User => {
  const token = randomUUID();
  const user = new User();
  user.status = 'online';
  user.username = 'mock' + randomUUID();
  user.token = token;
  user.friends = [];
  return user;
};
