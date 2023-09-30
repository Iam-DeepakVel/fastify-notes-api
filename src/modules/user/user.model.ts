import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import { hashSync } from 'bcrypt';

// Hash password before saving to DB
@pre<User>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const saltRounds = 13;
    this.password = hashSync(this.password, saltRounds);
    return next();
  }
})
export class User {
  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: {
    timestamps: true,
  },
});
