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
exports.ServiceServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const service_model_1 = require("./service.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createServiceIntoDB = (payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    const { Images } = images;
    if (Images) {
        payload.images = Images.map(image => image.path);
    }
    const result = yield service_model_1.Service.create(payload);
    return result;
});
const getAllServicesFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const searchableFields = ['name', 'description'];
    const services = new QueryBuilder_1.default(service_model_1.Service.find(), query)
        .search(searchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield services.modelQuery;
    return result;
});
const getSingleServiceFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.Service.findById(id);
    return result;
});
const updateServiceIntoDB = (id, payload, images) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceData = yield service_model_1.Service.findById(id);
    if (!serviceData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Service not found');
    }
    const { Images } = images;
    if (Images) {
        payload.images = Images.map(image => image.path);
    }
    const result = yield service_model_1.Service.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteServiceFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield service_model_1.Service.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
});
exports.ServiceServices = {
    createServiceIntoDB,
    getAllServicesFromDB,
    getSingleServiceFromDB,
    updateServiceIntoDB,
    deleteServiceFromDB
};
