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
exports.SlotService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const service_model_1 = require("../service/service.model");
const slot_model_1 = require("./slot.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createSlotIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const service = yield service_model_1.Service.findById(payload.service);
    if (!service)
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Service not found');
    const startHour = Number(payload === null || payload === void 0 ? void 0 : payload.startTime.split(':')[0]);
    const endHour = Number(payload === null || payload === void 0 ? void 0 : payload.endTime.split(':')[0]);
    const totalDuration = (endHour - startHour) * service.duration;
    const slots = Array.from({ length: totalDuration / service.duration }, (_, i) => ({
        service: payload === null || payload === void 0 ? void 0 : payload.service,
        date: payload === null || payload === void 0 ? void 0 : payload.date,
        startTime: `${startHour + i}:00`,
        endTime: `${startHour + i + 1}:00`,
    }));
    const result = yield slot_model_1.Slot.create(slots);
    return result;
});
const getSingleSlotFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield slot_model_1.Slot.findById(id);
    return result;
});
const getAvailableSlotsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchField = ['date'];
    const slotQuery = new QueryBuilder_1.default(slot_model_1.Slot.find().populate('service'), query)
        .search(searchField)
        .filter();
    const result = yield slotQuery.modelQuery;
    return result;
});
const updateSlotStatusIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isSlotExists = yield slot_model_1.Slot.findById(id);
    if (!isSlotExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This slot is not found !');
    }
    //const requestedStatus = payload.status;
    if (isSlotExists.isBooked === 'booked') {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'You can not change the status of a BOOKED Slot !');
    }
    const result = yield slot_model_1.Slot.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.SlotService = {
    createSlotIntoDB,
    getAvailableSlotsFromDB,
    getSingleSlotFromDB,
    updateSlotStatusIntoDB
};
