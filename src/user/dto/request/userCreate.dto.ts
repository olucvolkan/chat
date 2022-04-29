import { IsEmpty, IsNotEmpty } from 'class-validator';

export class UserCreateRequest {
  @IsNotEmpty()
  username: string;

  @IsEmpty()
  friends: string[];
}
