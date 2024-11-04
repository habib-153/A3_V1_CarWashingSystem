"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceBooking = void 0;
const mongoose_1 = require("mongoose");
const booking_constant_1 = require("./booking.constant");
const serviceBookingSchema = new mongoose_1.Schema({
    customer: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    serviceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true },
    slotId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Slot', required: true },
    vehicleType: { type: String, enum: booking_constant_1.vehicleType, required: true },
    vehicleModel: { type: String, required: true },
    vehicleBrand: { type: String, required: true },
    manufacturingYear: { type: Number, required: true },
    registrationPlate: { type: String, required: true },
    transactionId: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
exports.ServiceBooking = (0, mongoose_1.model)('Booking', serviceBookingSchema);
