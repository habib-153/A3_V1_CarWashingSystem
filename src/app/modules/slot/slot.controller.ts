import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SlotService } from "./slot.service";

const createSlots = catchAsync(async(req, res) =>{
    const service = await SlotService.createSlotIntoDB(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Slots created successfully',
        data: service
    })
})

const getAvailableSlots = catchAsync(async(req, res) => {
    const slots = await SlotService.getAvailableSlotsFromDB(req.query)
    
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Available slots retrieved successfully',
        data: slots
    })
})

export const SlotController = {
    createSlots,
    getAvailableSlots
}