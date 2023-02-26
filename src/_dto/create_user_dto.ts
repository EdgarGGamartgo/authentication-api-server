import {
  IsNotEmpty,
  IsString,
  Length,
  IsAlphanumeric,
  IsHalfWidth,
  IsAscii,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @IsHalfWidth()
  @IsAlphanumeric()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 20)
  @IsHalfWidth()
  @IsAscii()
  password: string;
}
