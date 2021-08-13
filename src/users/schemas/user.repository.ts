import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoInvalidArgumentError } from 'mongodb';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, description } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = new this.userModel({
      name,
      password: hashedPassword,
      email,
      description,
    });
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

  async getUserById(id: string): Promise<User> {
    let user;
    try {
      user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('There is no user with this ID.');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Invalid User Id');
    }
  }
}
