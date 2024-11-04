"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingValidation = void 0;
const zod_1 = require("zod");
const booking_constant_1 = require("./booking.constant");
const createBookingValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        serviceId: zod_1.z.string(),
        slotId: zod_1.z.string(),
        vehicleType: zod_1.z.enum([...booking_constant_1.vehicleType]),
        vehicleModel: zod_1.z.string(),
        vehicleBrand: zod_1.z.string(),
        manufacturingYear: zod_1.z.number().int().max(new Date().getFullYear()),
        registrationPlate: zod_1.z.string(),
        transactionId: zod_1.z.string().optional(),
        address: zod_1.z.string(),
        phone: zod_1.z.string(),
        paymentStatus: zod_1.z.string(),
        price: zod_1.z.number().optional()
    })
});
exports.BookingValidation = {
    createBookingValidationSchema
};
