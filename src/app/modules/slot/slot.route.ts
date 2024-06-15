import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SlotValidation } from './slot.validation';
import { SlotController } from './slot.controller';

const router = express.Router()


export const SlotRoutes = router