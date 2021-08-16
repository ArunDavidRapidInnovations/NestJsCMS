import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogRepository } from './schema/blog.repository';
import { Blog } from './schema/blog.schema';

@Injectable()
export class BlogService {
  constructor(private blogRepository: BlogRepository) {}

  async create(user: User, createBlogDto: CreateBlogDto): Promise<Blog> {
    return this.blogRepository.createBlogPost(user, createBlogDto);
  }

  async findAllOfUser(user: User): Promise<Blog[]> {
    return this.blogRepository.findAllOfUser(user);
  }

  async findAllOfUserID(id: string): Promise<Blog[]> {
    return this.blogRepository.findAllOfUserID(id);
  }

  async findOne(id: string): Promise<Blog> {
    return this.blogRepository.findOneByID(id);
  }

  async update(
    user: User,
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogRepository.updateOneByID(user, id, updateBlogDto);
  }

  async deleteOneByID(user: User, id: string): Promise<string> {
    return this.blogRepository.deleteOneByID(user, id);
  }
}
