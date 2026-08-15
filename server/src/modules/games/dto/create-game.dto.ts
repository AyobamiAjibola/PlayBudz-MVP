import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['outdoor', 'indoor'])
  gameType?: 'outdoor' | 'indoor';

  @IsString()
  sport!: string;

  @IsString()
  location!: string;

  @IsDateString()
  gameDateTime!: string;

  @IsString()
  players!: string;

  @IsString()
  skill_level!: string;
}

export class UpdateGameDto {
  @IsOptional()
  @IsString()
  imageUri?: string;

  @IsOptional()
  @IsString()
  @IsIn(['outdoor', 'indoor'])
  gameType?: 'outdoor' | 'indoor';

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sport?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  gameDateTime?: string;

  @IsOptional()
  @IsString()
  players?: string;

  @IsOptional()
  @IsString()
  skill_level?: string;
}
