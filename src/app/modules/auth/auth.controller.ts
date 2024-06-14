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

export const AuthController = {
    signUp,
    login
}