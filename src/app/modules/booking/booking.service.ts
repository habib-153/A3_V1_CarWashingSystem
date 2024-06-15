import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { Service } from '../service/service.model';
import { Slot } from '../slot/slot.model';
import { ServiceBooking } from './booking.model';
import { TBooking } from './booking.interface';

const createBookingIntoDB = async (payload: TBooking, user: JwtPayload) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userData = await User.findOne({
      email: user.email,
      role: user.role,
    }).session(session);
    if (!userData)
      throw new AppError(httpStatus.NOT_FOUND, 'User does not exist');

    const serviceData = await Service.findById(payload.serviceId).session(
      session,
    );
    if (!serviceData)
      throw new AppError(httpStatus.NOT_FOUND, 'Service not found');

    const slotData = await Slot.findById({
      _id: payload.slotId,
    }).session(session);
    if (!slotData)
      throw new AppError(httpStatus.NOT_FOUND, 'Slot does not exist');
    if (slotData.isBooked === 'booked')
      throw new AppError(httpStatus.BAD_REQUEST, 'This slot is already booked');

    await Slot.findByIdAndUpdate(payload.slotId, {
      isBooked: 'booked',
    }).session(session);

    const booking = await ServiceBooking.create(
      [{ ...payload, customer: userData._id }],
      { session: session },
    );
    await session.commitTransaction();
    session.endSession();

    const result = await ServiceBooking.findById(booking[0]._id)
      .populate('customer')
      .populate('slot')
      .populate('service');
    console.log('result', result);
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow the error after rollback
  }
};

export const BookingService = {
  createBookingIntoDB,
};
