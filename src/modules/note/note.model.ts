import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { User } from '../user/user.model';

export class Note {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true })
  title: string;

  @prop({ required: true })
  content: string;
}

export const NoteModel = getModelForClass(Note, {
  schemaOptions: {
    timestamps: true,
  },
});
