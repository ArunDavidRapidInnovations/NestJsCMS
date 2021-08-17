import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(32)
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  description: string;
}
