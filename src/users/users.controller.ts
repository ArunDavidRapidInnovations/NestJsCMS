import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { SigningResponse } from './interfaces/signin-response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto): Promise<SigningResponse> {
    return this.usersService.create(createUserDto);
  }
  @Post('/signin')
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<SigningResponse> {
    return this.usersService.loginUser(loginUserDto);
  }

  @UseGuards(AuthGuard())
  @Get('/me')
  findAll(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch('me')
  update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, updateUserDto);
  }

  @UseGuards(AuthGuard())
  @Delete('me')
  remove(@GetUser() user: User) {
    return this.usersService.remove(user);
  }
}
