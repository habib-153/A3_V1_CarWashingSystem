import { Types } from 'mongoose';
import { TIsBooked } from './slot.constant';

export type TSlot = {
  service: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: TIsBooked;
};
