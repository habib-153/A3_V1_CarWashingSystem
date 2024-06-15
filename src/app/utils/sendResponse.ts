import { Response } from 'express';

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response | any, data: TResponse<T>) => {
  if(res){
    res.status(data?.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
  });
  }
  else{
    res.status(500).json({
      message: 'No Data Found'
    })
  }
};

export default sendResponse;