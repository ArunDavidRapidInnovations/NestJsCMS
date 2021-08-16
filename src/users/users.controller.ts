import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Header,
  Response,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { SigningResponse } from './interfaces/signin-response.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import multer from 'multer';

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

  @UseGuards(AuthGuard())
  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: {
        fileSize: 1000000,
      },
      fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|JPG)$/)) {
          throw new BadRequestException('Please send proper file format');
        }
        cb(undefined, true);
      },
    }),
  )
  uploadAvatar(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    if (file) {
      return this.usersService.uploadAvatar(user, file);
    } else {
      throw new BadRequestException('please upload a file');
    }
  }

  @UseGuards(AuthGuard())
  @Delete('me/avatar')
  deleteAvatar(@GetUser() user: User): Promise<string> {
    return this.usersService.deleteAvatar(user);
  }

  @Get(':id/avatar')
  async getUserAvatar(
    @Param('id') userID: string,
    @Response() res,
  ): Promise<any> {
    return res
      .set('Content-Type', 'image/png')
      .send(await this.usersService.getUserAvatar(userID));
  }
}
