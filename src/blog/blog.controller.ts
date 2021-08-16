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
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './schema/blog.schema';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(
    @GetUser() user: User,
    @Body() createBlogDto: CreateBlogDto,
  ): Promise<Blog> {
    return this.blogService.create(user, createBlogDto);
  }

  @Get('me')
  @UseGuards(AuthGuard())
  findAll(@GetUser() user: User): Promise<Blog[]> {
    return this.blogService.findAllOfUser(user);
  }

  @Get('/user/:id')
  findAllByUserID(@Param('id') id: string): Promise<Blog[]> {
    return this.blogService.findAllOfUserID(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Blog> {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<Blog> {
    return this.blogService.update(user, id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  remove(@GetUser() user: User, @Param('id') id: string): Promise<string> {
    return this.blogService.deleteOneByID(user, id);
  }
}
