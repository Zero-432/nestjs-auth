import { Schema, Prop, SchemaFactory, raw } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from '../common/enums/role.enum';
import { Article } from './article.schema';
import { Type } from 'class-transformer';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'Duplicate email entered'] })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ required: true, default: [Role.User] })
  roles: Role[];

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }] })
  // @Type(() => Article)
  // articles: Article[];

  @Prop(
    raw({
      avatar: String,
      phone: String,
      address: String,
      city: String,
      age: Number,
      registrarId: Number,
      zipCode: String,
    }),
  )
  profile: Record<string, any>;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'author',
  justOne: false,
});

export { UserSchema };
