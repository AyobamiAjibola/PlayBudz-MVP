import { IsString } from 'class-validator';

export class UserInterestDto {
  @IsString()
  interest!: string;

  @IsString()
  skillLevel!: string;
}
