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

export const BookingController = {
    createBooking
}