import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { TUserLogin } from "./auth.interface";
import config from "../../config";

const userSignUp = async(payload: TUser) => {
    const result = await User.create(payload)
    return result
}

const userLogIn = async(payload: TUserLogin)=>{
    const user = await User.findOne({email: payload.email}).select('+password')

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND, 'User not exits')
    }
    // match password
    const passwordMatch = await bcrypt.compare(payload.password, user.password)
    if(!passwordMatch){
        throw new AppError(httpStatus.FORBIDDEN, 'Password not match')
    }
    // create payload
    const jwtPayload = {
        email: user?.email,
        role: user?.role
    }

    const jwtToken =  jwt.sign(jwtPayload, config.jwt_secret as string, {expiresIn: config.jwt_expires_in as string})

    return {
        user,
        jwtToken
    }
}
export const AuthService = {
    userSignUp,
    userLogIn
}
