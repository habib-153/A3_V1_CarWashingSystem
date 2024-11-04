import { Types } from "mongoose"
import { TVehicleTypes } from "./booking.constant"

export type TBooking = {
    customer: Types.ObjectId
    serviceId: Types.ObjectId
    slotId: Types.ObjectId
    vehicleType: TVehicleTypes
    vehicleModel: string
    vehicleBrand: string
    manufacturingYear: number
    registrationPlate: string
    transactionId: string
    address: string
    phone: string
    paymentStatus: string
    price: number
    createdAt?: Date
    updatedAt?: Date
}
