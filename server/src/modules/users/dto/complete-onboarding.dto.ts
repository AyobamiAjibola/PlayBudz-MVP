import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class CompleteOnboardingDto {
  @IsString()
  dob!: string;

  @IsString()
  gender!: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @Transform(({ value }) => JSON.parse(value))
  @IsArray()
  @IsString({ each: true })
  interests!: string[];

  @Transform(({ value }) => JSON.parse(value))
  @ValidateNested()
  @Type(() => LocationDto)
  location!: LocationDto;
}
