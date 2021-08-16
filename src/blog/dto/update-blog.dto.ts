import { IsOptional, IsString } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString({ each: true })
  @IsOptional()
  tags: string[];
}
