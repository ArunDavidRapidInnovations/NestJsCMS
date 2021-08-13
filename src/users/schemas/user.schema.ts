import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  @IsString()
  name: string;

  @Prop({ type: String, required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ type: String, required: true })
  @IsString()
  password: string;

  @Prop({ type: String, default: 'Some Bloke with no Description' })
  @IsOptional()
  @IsString()
  description: string;

  // @Prop(Buffer)
  // @IsOptional()
  // @IsBase64()
  // avatar: string;

  @Prop([String])
  @IsString({ each: true })
  accessTokens: string[];
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
