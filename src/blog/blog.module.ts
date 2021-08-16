import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Blog, BlogSchema } from './schema/blog.schema';
import { BlogRepository } from './schema/blog.repository';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: Blog.name,
        useFactory: () => {
          const schema = BlogSchema;
          return schema;
        },
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService, BlogRepository],
})
export class BlogModule {}
