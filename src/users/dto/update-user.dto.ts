import {
  IsString,
  IsEmail,
  IsOptional,
  IS_EMPTY,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @ValidateIf((o) => o == undefined, { message: 'You cannot update the email' })
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
