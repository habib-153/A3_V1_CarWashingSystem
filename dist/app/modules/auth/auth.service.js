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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const booking_model_1 = require("../booking/booking.model");
const userSignUp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    return result;
});
const userLogIn = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email }).select('+password');
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not exits');
    }
    // match password
    const passwordMatch = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!passwordMatch) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Password not match');
    }
    // create payload
    const jwtPayload = {
        email: user === null || user === void 0 ? void 0 : user.email,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    const jwtToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_secret, {
        expiresIn: config_1.default.jwt_expires_in,
    });
    return {
        user,
        jwtToken,
    };
});
const getAllUserFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchableFields = ['name', 'email'];
    const users = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(searchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield users.modelQuery;
    const meta = yield users.countTotal();
    return { result, meta };
});
const getUserFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ email: email });
    return result;
});
const updateUserIntoDB = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const getUserStats = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const email = user.email;
    const userData = yield user_model_1.User.findOne({ email: email });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const bookings = yield booking_model_1.ServiceBooking.find({ customer: userData._id });
    const totalSpend = bookings.reduce((sum, booking) => sum + booking.price, 0);
    const totalBookings = bookings.length;
    const monthlyStats = bookings.reduce((acc, booking) => {
        var _a, _b;
        const month = (_a = booking === null || booking === void 0 ? void 0 : booking.createdAt) === null || _a === void 0 ? void 0 : _a.getMonth();
        const year = (_b = booking === null || booking === void 0 ? void 0 : booking.createdAt) === null || _b === void 0 ? void 0 : _b.getFullYear();
        const key = `${year}-${month}`;
        if (!acc[key]) {
            acc[key] = { spend: 0, bookings: 0 };
        }
        acc[key].spend += booking.price;
        acc[key].bookings += 1;
        return acc;
    }, {});
    const uniqueServices = new Set(bookings.map(booking => booking.serviceId.toString()));
    const totalServicesAvailed = uniqueServices.size;
    const serviceFrequency = bookings.reduce((acc, booking) => {
        const serviceId = booking.serviceId.toString();
        if (!acc[serviceId]) {
            acc[serviceId] = 0;
        }
        acc[serviceId] += 1;
        return acc;
    }, {});
    const mostFrequentService = Object.keys(serviceFrequency).reduce((a, b) => serviceFrequency[a] > serviceFrequency[b] ? a : b, '');
    const averageSpendPerBooking = totalSpend / totalBookings;
    const mostRecentBooking = bookings.sort((a, b) => { var _a, _b; return (((_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.createdAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); })[0];
    const result = {
        totalSpend,
        totalBookings,
        monthlyStats,
        totalServicesAvailed,
        mostFrequentService,
        averageSpendPerBooking,
        mostRecentBooking,
    };
    return result;
});
exports.AuthService = {
    userSignUp,
    userLogIn,
    getAllUserFromDB,
    updateUserIntoDB,
    getUserFromDB,
    getUserStats
};
