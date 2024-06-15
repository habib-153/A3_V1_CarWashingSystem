import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ServiceServices } from "./service.service";

const createService = catchAsync(async (req, res) => {
    const service = await ServiceServices.createServiceIntoDB(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Service created successfully',
        data: service
    })
})

const getAllServices = catchAsync(async (req, res) => {
    const services = await ServiceServices.getAllServicesFromDB()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Services retrieved successfully',
        data: services
    })
})

const getSingleService = catchAsync(async (req, res) => {
    const { id} = req.params

    const service = await ServiceServices.getSingleServiceFromDB(id)
    sendResponse(res,{
        success: true,
        statusCode: httpStatus.OK,
        message: 'Service retrieved successfully',
        data: service
    })
})

const updateService = catchAsync(async (req, res) => {
    const { id } = req.params

    const service = await ServiceServices.updateServiceIntoDB(id, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Service updated successfully',
        data: service
    })
})

const deleteService = catchAsync(async (req, res) => {
    const { id } = req.params

    const service = await ServiceServices.deleteServiceFromDB(id)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Service deleted successfully',
        data: service
    })
})

export const ServiceController = {
    createService,
    getAllServices,
    getSingleService,
    updateService,
    deleteService
}