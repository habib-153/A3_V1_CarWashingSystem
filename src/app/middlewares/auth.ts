import { TRole } from '../modules/user/user.interface';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';
import { NextFunction, Request, Response } from 'express';

const auth = (...userRoles: TRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction)=> {
    try {
      const token = req.headers?.authorization?.split(' ')[1];
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      const decoded = jwt.verify(
        token,
        config.jwt_secret as string,
      ) as JwtPayload;
      const { email, role } = decoded;

      const user = await User.findOne({ email, role });
      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
      }

      if (!userRoles?.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }
      // console.log('decoded', decoded)
      // console.log(token)
      
      // req.user = decoded as JwtPayload
      next()
    } catch (err) {
        sendResponse(res,{
            success:false,
            statusCode: httpStatus.UNAUTHORIZED,
            message: 'You are not authorized!',
            data: ''
        })
    }
  })
}

export default auth;
