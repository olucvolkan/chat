import { IsEmpty, IsNotEmpty } from 'class-validator';

export class UserCreateRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  message: string;

  @IsEmpty()
  friends: string[];
}
