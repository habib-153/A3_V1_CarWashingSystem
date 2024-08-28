import { z } from "zod";
import { vehicleType } from "./booking.constant";

const createBookingValidationSchema = z.object({
    body: z.object({
        serviceId: z.string(),
        slotId: z.string(),
        vehicleType: z.enum([...vehicleType] as [string, ...string[]]),
        vehicleModel: z.string(),
        vehicleBrand: z.string(),
        manufacturingYear: z.number().int().max(new Date().getFullYear()),
        registrationPlate: z.string(),
        transactionId: z.string().optional(),
        address: z.string(),
        phone: z.string(),
        paymentStatus: z.string(),
        price: z.number().optional()
    })
})

export const BookingValidation = {
    createBookingValidationSchema
}