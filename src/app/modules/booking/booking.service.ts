import mongoose from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { Service } from '../service/service.model';
import { Slot } from '../slot/slot.model';
import { ServiceBooking } from './booking.model';
import { TBooking } from './booking.interface';
import { initiatePayment } from '../../utils/payment';

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

    const slotData = await Slot.findOne({
      _id: payload.slotId,
      service: payload.serviceId,
    }).session(session);
    if (!slotData)
      throw new AppError(httpStatus.NOT_FOUND, 'Slot does not exist');
    if (slotData.isBooked === 'booked')
      throw new AppError(httpStatus.BAD_REQUEST, 'This slot is already booked');

    const transactionId = `TXN-${payload.serviceId}`
    const paymentInfo = {
      transactionId,
      customerName: userData.name,
      customerEmail: userData.email,
      customerPhone: payload.phone,
      customerAddress: payload.address,
      price: serviceData.price
    }

    const payment = await initiatePayment(paymentInfo)

    await Slot.findByIdAndUpdate(payload.slotId, {
      isBooked: 'booked',
    }).session(session);

    const booking = await ServiceBooking.create(
      [{ ...payload, customer: userData._id }],
      { session: session },
    );
    await session.commitTransaction();
    session.endSession();

    const result = await ServiceBooking.findById(booking[0]._id).populate('serviceId customer slotId')
    return {result, payment}
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow the error after rollback
  }
};

  const getAllBookingsFromDB = async() =>{
    const result = await ServiceBooking.find().populate('serviceId customer slotId')
    return result
  }

  const getUserBookingsFromDB = async(payload: JwtPayload) =>{
    const user = await User.findOne({ email: payload?.email})

    const result = await ServiceBooking.find({customer: user?._id}).populate('serviceId slotId')
    return result
  }
export const BookingService = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    getUserBookingsFromDB
}