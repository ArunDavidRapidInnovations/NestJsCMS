import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';
import { UsersModule } from './users/users.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      validationSchema: configValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        console.log(
          `mongodb://${configService.get('DB_HOST')}:${configService.get(
            'DB_PORT',
          )}/${configService.get('DB_DATABASE')}`,
        );
        return {
          uri: `mongodb://${configService.get('DB_HOST')}:${configService.get(
            'DB_PORT',
          )}/${configService.get('DB_DATABASE')}`,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    // Normal Modules import
    UsersModule,
    BlogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
