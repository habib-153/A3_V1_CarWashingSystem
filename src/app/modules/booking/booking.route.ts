import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BookingValidation } from './booking.validation';
import { BookingController } from './booking.controller';

const router = express.Router();

router.post('/bookings', auth('user'), validateRequest(BookingValidation.createBookingValidationSchema), BookingController.createBooking)

export const BookingRoutes = router;