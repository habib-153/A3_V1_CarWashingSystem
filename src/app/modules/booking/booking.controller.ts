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

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All bookings retrieved successfully',
        data: result
    })
})

const getUserBookings = catchAsync( async(req, res) =>{
    const user = req.user;
    const result = await BookingService.getUserBookingsFromDB(user as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User bookings retrieved successfully',
        data: result
    })
})

export const BookingController = {
    createBooking, getAllBookings, getUserBookings
}