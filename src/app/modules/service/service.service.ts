import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TService } from './service.interface';
import { Service } from './service.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { TImageFiles } from '../../interface/image.interface';

const createServiceIntoDB = async (payload: TService, images: TImageFiles) => {
  const {Images} = images;
  if (Images) {
    payload.images = Images.map(image => image.path)
  }

  const result = await Service.create(payload);
  return result;
};

const getAllServicesFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['name', 'description']

  const services = new QueryBuilder(Service.find(), query)
  .search(searchableFields)
  .filter()
  .sort()
  .paginate()
  .fields()

  const result = await services.modelQuery
  return result;
};

const getSingleServiceFromDB = async (id: string) => {
  const result = await Service.findById(id);
  return result;
};

const updateServiceIntoDB = async (id: string, payload: Partial<TService>, images: TImageFiles) => {
  const serviceData = await Service.findById(id);

  if (!serviceData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Service not found');
  }

  const {Images} = images;
  if (Images) {
    payload.images = Images.map(image => image.path)
  }
  
  const result = await Service.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteServiceFromDB = async (id: string) => {
    const result = await Service.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
}

export const ServiceServices = {
    createServiceIntoDB,
    getAllServicesFromDB,
    getSingleServiceFromDB,
    updateServiceIntoDB,
    deleteServiceFromDB
} 
