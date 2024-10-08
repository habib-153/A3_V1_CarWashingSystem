import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SlotService } from './slot.service';
import { Request, Response } from 'express';

const createSlots = catchAsync(async (req, res) => {
  const service = await SlotService.createSlotIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Slots created successfully',
    data: service,
  });
});

const getSingleSlot = catchAsync(async (req, res) => {
  const { id } = req.params;

  const service = await SlotService.getSingleSlotFromDB(id);
  if (service) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Slot retrieved successfully',
      data: service,
    });
  } else {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No Data Found',
      data: [],
    });
  }
});

const getAvailableSlots = catchAsync(async (req, res) => {
  const slots = await SlotService.getAvailableSlotsFromDB(req.query);

  if (slots.length > 0) {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Available slots retrieved successfully',
      data: slots,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'No Data Available',
      data: [],
    });
  }
});

const updateSlotStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SlotService.updateSlotStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slot Status is updated successfully',
    data: result,
  });
});

export const SlotController = {
  createSlots,
  getAvailableSlots,
  getSingleSlot,
  updateSlotStatus,
};
