import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SigningResponse } from '../interfaces/signin-response.interface';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async loginUser(loginUserDto: LoginUserDto): Promise<SigningResponse> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { id: user._id };
      const accessToken: string = await this.jwtService.sign(payload);
      const resData: SigningResponse = {
        accessToken,
        userData: user.toJSON(),
      };
      return resData;
    } else {
      throw new UnauthorizedException('User Name or Password Error');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<SigningResponse> {
    const { name, email, password, description } = createUserDto;

    const createdUser = new this.userModel({
      name,
      password,
      email,
      description,
    });
    try {
      await createdUser.save();
      return this.loginUser({ email, password });
    } catch (error) {
      if (error.code == 11000) {
        throw new ConflictException('User already exists.');
      }
      throw new InternalServerErrorException('Some Error Occurred');
    }
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

  async deleteUser(user: User): Promise<void> {
    try {
      await this.userModel.deleteOne({ _id: user._id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const fieldsToUpdate = Object.keys(updateUserDto);
      const updatedUser = await this.userModel.findById(user._id);
      fieldsToUpdate.forEach((field) => {
        updatedUser[field] = updateUserDto[field];
      });
      // await this.userModel.updateOne(
      //   { _id: user._id },
      //   { ...updateUserDto },
      //   {
      //     omitUndefined: true,
      //   },
      // );
      return await updatedUser.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
