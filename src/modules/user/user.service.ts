import { CreateUserDto } from './dtos/user.dtos';
import { UserModel } from './user.model';

export async function createUser(data: CreateUserDto) {
  return UserModel.create(data);
}

export async function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}
