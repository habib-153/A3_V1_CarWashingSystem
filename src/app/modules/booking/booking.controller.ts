import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { BookingService } from "./booking.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createBooking = catchAsync(async (req, res) => {
    const user = req.user;
    const result = await BookingService.createBookingIntoDB(req.body, user as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Booking successful',
        data: result
    })
})

const getAllBookings = catchAsync(async(req, res) => {
    const result = await BookingService.getAllBookingsFromDB()

    if(result.length > 0){
        sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All bookings retrieved successfully',
        data: result
    })
    }
    else{
        sendResponse(res,{
            success:false,
            statusCode: httpStatus.NOT_FOUND,
            message:'No Data Found',
            data: []
        })
    }
})

const getUserBookings = catchAsync( async(req, res) =>{
    const user = req.user;
    const result = await BookingService.getUserBookingsFromDB(user as JwtPayload)
    if(result.length > 0){
        sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User bookings retrieved successfully',
        data: result
    })
    }
    else{
        sendResponse(res,{
            success:false,
            statusCode: httpStatus.NOT_FOUND,
            message:'No Data Found',
            data: []
        })
    }
})

export const BookingController = {
    createBooking, getAllBookings, getUserBookings
}