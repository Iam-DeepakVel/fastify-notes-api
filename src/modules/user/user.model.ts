import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const saltRounds = 13;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return next();
  }
});


export const UserModel = mongoose.model('User', userSchema);
