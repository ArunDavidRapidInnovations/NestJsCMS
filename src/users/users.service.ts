import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigningResponse } from './interfaces/signin-response.interface';
import { UserRepository } from './schemas/user.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<SigningResponse> {
    return this.userRepository.createUser(createUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<SigningResponse> {
    return this.userRepository.loginUser(loginUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return this.userRepository.getUserById(id);
  }

  update(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    delete updateUserDto.email;
    return this.userRepository.updateUser(user, updateUserDto);
  }

  async remove(user: User): Promise<string> {
    await this.userRepository.deleteUser(user);
    return 'The User has been deleted';
  }

  async uploadAvatar(user: User, file: Express.Multer.File): Promise<string> {
    const imgBuffer = await sharp(file.buffer)
      .resize({ width: 300, height: 300 })
      .png()
      .toBuffer();

    return await this.userRepository.uploadAvatar(
      user,
      imgBuffer,
      file.mimetype,
    );
  }

  async getUserAvatar(userID: string): Promise<any> {
    return this.userRepository.getUserAvatar(userID);
  }

  async deleteAvatar(user: User): Promise<string> {
    return this.userRepository.deleteAvatar(user);
  }
}
