import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post('/bookings', auth('user'), validateRequest(BookingValidation.createBookingValidationSchema), BookingController.createBooking)

router.get('/bookings', auth('admin'), BookingController.getAllBookings)

router.get('/my-bookings', auth('user'), BookingController.getUserBookings)
export const BookingRoutes = router;