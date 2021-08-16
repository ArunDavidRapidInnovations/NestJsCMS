import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

import { v4 as uuid } from 'uuid';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop({ type: String, required: true })
  @IsString()
  _id: string;

  @Prop({ type: String, required: true })
  @IsString()
  title: string;

  @Prop({ type: String, required: true })
  @IsString()
  description: string;

  @Prop({ type: String, required: true })
  @IsString()
  content: string;

  @Prop({ type: [String] })
  @IsOptional()
  @IsString({ each: true })
  tags: string[];

  @Prop({
    type: {
      data: Buffer,
      contentType: String,
    },
  })
  @IsOptional()
  image: {
    data: Buffer;
    contentType: string;
  };

  @Prop({ type: String, ref: User.name })
  author: User;
}

const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    // delete ret.accessTokens;
    delete ret.image;
  },
});

export { BlogSchema };
