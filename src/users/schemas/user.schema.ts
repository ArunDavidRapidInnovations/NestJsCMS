import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
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

  @Prop({ data: Buffer, contentType: String })
  @IsOptional()
  @IsString()
  avatar: string;

  @Prop([String])
  @IsString({ each: true })
  accessTokens: string[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.accessTokens;
    delete ret.avatar;
    delete ret.password;
  },
});

export { UserSchema };
