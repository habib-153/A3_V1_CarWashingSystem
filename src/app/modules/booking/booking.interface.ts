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
}
