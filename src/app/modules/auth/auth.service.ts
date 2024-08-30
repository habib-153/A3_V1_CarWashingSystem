import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TUserLogin } from './auth.interface';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';

const userSignUp = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const userLogIn = async (payload: TUserLogin) => {
  const user = await User.findOne({ email: payload.email }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not exits');
  }
  // match password
  const passwordMatch = await bcrypt.compare(payload.password, user.password);
  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password not match');
  }
  // create payload
  const jwtPayload = {
    email: user?.email,
    role: user?.role,
  };

  const jwtToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: config.jwt_expires_in as string,
  });

  return {
    user,
    jwtToken,
  };
};

const getAllUserFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['name', 'email'];
  const users = new QueryBuilder(User.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await users.modelQuery;
  const meta = await users.countTotal()

  return {result, meta};
};

const getUserFromDB = async (email: string) => {
  const result = await User.findOne({email: email})
  return result;
}

const updateUserIntoDB = async (payload: Partial<TUser>, id: string) => {
  
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};
export const AuthService = {
  userSignUp,
  userLogIn,
  getAllUserFromDB,
  updateUserIntoDB,
  getUserFromDB,
};
