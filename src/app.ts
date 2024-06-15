import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import notFound from './app/middlewares/notFound';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './app/routes';
import { BookingRoutes } from './app/modules/booking/booking.route';

const app: Application = express();
//const port = 3000

app.use(express.json());
app.use(cors());

//  application routes
app.use('/api', router)
app.use('/api', BookingRoutes)

app.get('/', (req: Request, res: Response) => {
  //const a = 10;
  res.send("Hello !! want to wash your car?");
});

app.use(globalErrorHandler)
app.use(notFound)

export default app;
