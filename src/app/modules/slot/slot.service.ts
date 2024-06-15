import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Service } from '../service/service.model';
import { TSlot } from './slot.interface';
import { Slot } from './slot.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { date } from 'zod';

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
  //console.log(slots);
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

export const SlotService = {
  createSlotIntoDB,
  getAvailableSlotsFromDB
};
