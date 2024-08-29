import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Service } from '../service/service.model';
import { TSlot } from './slot.interface';
import { Slot } from './slot.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createSlotIntoDB = async (payload: TSlot) => {
  const service = await Service.findById(payload.service);

  if (!service) throw new AppError(httpStatus.NOT_FOUND, 'Service not found');

  const startHour = Number(payload?.startTime.split(':')[0]);
  const endHour = Number(payload?.endTime.split(':')[0]);
  const totalDuration = (endHour - startHour) * service.duration;

  const slots = Array.from(
    { length: totalDuration / service.duration },
    (_, i) => ({
      service: payload?.service,
      date: payload?.date,
      startTime: `${startHour + i}:00`,
      endTime: `${startHour + i + 1}:00`,
    }),
  );

  const result = await Slot.create(slots);
  return result;
};

const getSingleSlotFromDB = async (id: string) => {
  const result = await Slot.findById(id);
  return result;
};

const getAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
  const searchField = ['date'];
  
  const slotQuery = new QueryBuilder(Slot.find().populate('service'), query)
    .search(searchField)
    .filter();
  
  const result = await slotQuery.modelQuery
  return result
};

const updateSlotStatusIntoDB = async(id: string, payload: Record<string, unknown>) => {
  const isSlotExists = await Slot.findById(id);

  if (!isSlotExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This slot is not found !');
  }

  //const requestedStatus = payload.status;

  if (isSlotExists.isBooked === 'booked') {
    throw new AppError(httpStatus.BAD_REQUEST, 'You can not change the status of a BOOKED Slot !');
  }
  
  const result = await Slot.findByIdAndUpdate(id, payload, { new: true });
  return result;
}

export const SlotService = {
  createSlotIntoDB,
  getAvailableSlotsFromDB,
  getSingleSlotFromDB,
  updateSlotStatusIntoDB
};
