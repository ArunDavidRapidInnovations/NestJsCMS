import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';

import { Blog, BlogDocument } from './blog.schema';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel('Blog') private blogModule: Model<BlogDocument>) {}

  async createBlogPost(
    user: User,
    createBlogDto: CreateBlogDto,
  ): Promise<Blog> {
    const { title, description, content, tags } = createBlogDto;

    const createdBlogPost = new this.blogModule({
      title,
      description,
      content,
      tags,
      author: user._id,
      _id: new Types.ObjectId(),
    });

    try {
      return await createdBlogPost.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllOfUser(user: User): Promise<Blog[]> {
    try {
      console.log(user._id);
      const blogs = await this.blogModule
        .find({
          author: user._id.toString(),
        })
        .populate('author');
      return blogs;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllOfUserID(id: string): Promise<Blog[]> {
    try {
      const blogs = await this.blogModule
        .find({
          author: id,
        })
        .populate('author');
      return blogs;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOneByID(id: string): Promise<Blog> {
    try {
      const blog = await this.blogModule.findById(id);
      if (!blog) {
        throw new NotFoundException('There is no blog post with that ID');
      }
      return blog;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateOneByID(user: User, id: string, updateBlogDto: UpdateBlogDto) {
    try {
      const blogToUpdate = await this.blogModule.findOne({
        _id: id,
        author: user._id.toString(),
      });
      const fieldsToUpdate = Object.keys(updateBlogDto);
      if (fieldsToUpdate) {
        fieldsToUpdate.forEach((field) => {
          if (field) {
            blogToUpdate[field] = updateBlogDto[field];
          }
        });
        await blogToUpdate.save();
        return blogToUpdate;
      } else {
        throw new NotFoundException('There is no Blog with that ID');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteOneByID(user, id): Promise<string> {
    try {
      await this.blogModule.deleteOne({ _id: id, author: user._id.toString() });
      return `Blog with id = ${id} has been deleted successfully`;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
