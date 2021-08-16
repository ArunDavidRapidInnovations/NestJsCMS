import { IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  content: string;

  @IsString({ each: true })
  tags: string[];
}
