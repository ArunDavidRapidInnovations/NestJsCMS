import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    try {
      await createdUser.save();
    } catch (error) {
      if (error.code == 11000) {
        throw new ConflictException('User already exists.');
      }
      throw new InternalServerErrorException('Some Error Occurred');
    }

    return createdUser;
  }
}
