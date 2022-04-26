import { IsNotEmpty } from 'class-validator';

export class AddFriendsRequest {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  friends: string[];
}
