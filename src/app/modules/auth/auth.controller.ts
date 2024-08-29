import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const signUp = catchAsync(async (req, res) => {
    const user = await AuthService.userSignUp(req.body)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User registered successfully',
        data: user
    })
})

const login = catchAsync(async(req, res)=>{
    const { user, jwtToken} = await AuthService.userLogIn(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        token: jwtToken,
        data: user
    })
})

const getAllUsers = catchAsync(async(req, res)=>{
    const result = await AuthService.getAllUserFromDB(req.query)
    // console.log(result)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'All users retrieved successfully',
        data: result.result,
        meta: result.meta
    })
})

const updateUser = catchAsync(async(req, res)=>{
    const { id } = req.params
    const result = await AuthService.updateUserIntoDB(req.body, id)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User updated successfully',
        data: result
    })
})

export const AuthController = {
    signUp,
    login,
    getAllUsers,
    updateUser
}