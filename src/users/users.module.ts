import { InternalServerErrorException, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './schemas/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Module({
  providers: [UserRepository, UsersService, JwtStrategy],
  imports: [
    ConfigModule,
    // MongooseModule.forFeatureAsync([
    //   {
    //     name: User.name,
    //     useFactory: () => {
    //       const schema = UserSchema;
    //       // schema.pre<User>('save', async function () {
    //       //   const base64regex =
    //       //     /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    //       //   if (!base64regex.test(this.password)) {
    //       //     const salt = await bcrypt.genSalt();
    //       //     const hash = await bcrypt.hash(this.password, salt);
    //       //     this.password = hash;
    //       //   }
    //       // });
    //       return schema;
    //     },
    //   },
    // ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  controllers: [UsersController],
  exports: [JwtStrategy, PassportModule],
})
export class UsersModule {}
