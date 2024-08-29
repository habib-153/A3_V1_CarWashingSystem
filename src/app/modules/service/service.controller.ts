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
    const query = req.query
    const services = await ServiceServices.getAllServicesFromDB(query)

    if(services.length > 0){
        sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Services retrieved successfully',
        data: services
    })
    }
    else{
        sendResponse(res,{
            success:true,
            statusCode: httpStatus.OK,
            message:'No Data Found',
            data: []
        })
    }
})

const getSingleService = catchAsync(async (req, res) => {
    const { id} = req.params

    const service = await ServiceServices.getSingleServiceFromDB(id)
    if(service){
        sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Service retrieved successfully',
        data: service
    })
    }
    else{
        sendResponse(res,{
            success:false,
            statusCode: httpStatus.NOT_FOUND,
            message:'No Data Found',
            data: []
        })
    }
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