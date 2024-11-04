"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const service_model_1 = require("../service/service.model");
const slot_model_1 = require("../slot/slot.model");
const booking_model_1 = require("./booking.model");
const payment_1 = require("../../utils/payment");
const createBookingIntoDB = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userData = yield user_model_1.User.findOne({
            email: user.email,
            role: user.role,
        }).session(session);
        if (!userData)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
        const serviceData = yield service_model_1.Service.findById(payload.serviceId).session(session);
        if (!serviceData)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Service not found');
        const slotData = yield slot_model_1.Slot.findOne({
            _id: payload.slotId,
            service: payload.serviceId,
        }).session(session);
        if (!slotData)
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Slot does not exist');
        if (slotData.isBooked === 'booked')
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'This slot is already booked');
        const transactionId = `TXN-${payload.slotId}`;
        const paymentInfo = {
            transactionId,
            customerName: userData.name,
            customerEmail: userData.email,
            customerPhone: payload.phone,
            customerAddress: payload.address,
            price: serviceData.price
        };
        const payment = yield (0, payment_1.initiatePayment)(paymentInfo);
        yield slot_model_1.Slot.findByIdAndUpdate(payload.slotId, {
            isBooked: 'booked',
        }).session(session);
        const booking = yield booking_model_1.ServiceBooking.create([Object.assign(Object.assign({}, payload), { customer: userData._id, price: serviceData.price, transactionId })], { session: session });
        yield session.commitTransaction();
        session.endSession();
        const result = yield booking_model_1.ServiceBooking.findById(booking[0]._id).populate('serviceId customer slotId');
        return { result, payment };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error; // Rethrow the error after rollback
    }
});
const getAllBookingsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_model_1.ServiceBooking.find().populate('serviceId customer slotId');
    return result;
});
const getUserBookingsFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email });
    const result = yield booking_model_1.ServiceBooking.find({ customer: user === null || user === void 0 ? void 0 : user._id }).populate('serviceId customer slotId');
    return result;
});
exports.BookingService = {
    createBookingIntoDB,
    getAllBookingsFromDB,
    getUserBookingsFromDB
};
