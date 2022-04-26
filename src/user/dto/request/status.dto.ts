import { IsNotEmpty } from 'class-validator';

export class StatusRequest {

  @IsNotEmpty()
  status: string;
}
