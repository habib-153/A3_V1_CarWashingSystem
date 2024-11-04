import { Schema, model } from "mongoose";
import { vehicleType } from "./booking.constant";
import { TBooking } from "./booking.interface";

const serviceBookingSchema = new Schema<TBooking>({
    customer: { type: Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    slotId: { type: Schema.Types.ObjectId, ref: 'Slot', required: true },
    vehicleType: { type: String, enum: vehicleType, required: true },
    vehicleModel: { type: String, required: true },
    vehicleBrand: { type: String, required: true },
    manufacturingYear: { type: Number, required: true },
    registrationPlate: { type: String, required: true },
    transactionId: { type: String, required: true },
    address: { type: String , required: true},
    phone: { type: String , required: true},
    paymentStatus: { type: String , required: true},
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},
{
    timestamps: true
})

export const ServiceBooking = model<TBooking>('Booking', serviceBookingSchema)