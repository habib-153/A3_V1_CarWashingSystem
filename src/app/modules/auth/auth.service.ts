import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TUserLogin } from './auth.interface';
import config from '../../config';
import QueryBuilder from '../../builder/QueryBuilder';
import { ServiceBooking } from '../booking/booking.model';

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

const getUserStats = async (user: TUser) => {
  const email = user.email;
  const userData = await User.findOne({ email: email });
  if (!userData) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const bookings = await ServiceBooking.find({ customer: userData._id });

  const totalSpend = bookings.reduce((sum, booking) => sum + booking.price, 0);
  const totalBookings = bookings.length;

  const monthlyStats = bookings.reduce((acc: { [key: string]: { spend: number; bookings: number } }, booking) => {
    const month = booking?.createdAt?.getMonth();
    const year = booking?.createdAt?.getFullYear();
    const key = `${year}-${month}`;

    if (!acc[key]) {
      acc[key] = { spend: 0, bookings: 0 };
    }

    acc[key].spend += booking.price;
    acc[key].bookings += 1;

    return acc;
  }, {});

  const uniqueServices = new Set(bookings.map(booking => booking.serviceId.toString()));
  const totalServicesAvailed = uniqueServices.size;

  const serviceFrequency: Record<string, number> = bookings.reduce((acc: Record<string, number>, booking) => {
    const serviceId = booking.serviceId.toString();
    if (!acc[serviceId]) {
      acc[serviceId] = 0;
    }
    acc[serviceId] += 1;
    return acc;
  }, {});

  const mostFrequentService = Object.keys(serviceFrequency).reduce((a, b) => serviceFrequency[a] > serviceFrequency[b] ? a : b, '');

  const averageSpendPerBooking = totalSpend / totalBookings;

  const mostRecentBooking = bookings.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))[0];

  const result = {
    totalSpend,
    totalBookings,
    monthlyStats,
    totalServicesAvailed,
    mostFrequentService,
    averageSpendPerBooking,
    mostRecentBooking,
  }
  return result;
};

export const AuthService = {
  userSignUp,
  userLogIn,
  getAllUserFromDB,
  updateUserIntoDB,
  getUserFromDB,
  getUserStats
};
