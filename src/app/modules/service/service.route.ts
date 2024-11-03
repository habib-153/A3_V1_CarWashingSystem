import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceValidation } from './service.validation';
import { ServiceController } from './service.controller';
import { SlotValidation } from '../slot/slot.validation';
import { SlotController } from '../slot/slot.controller';
import { multerUpload } from '../../config/multer.config';
import { parseBody } from '../../middlewares/bodyParser';

const router = express.Router();

router.post('/', auth('admin'), multerUpload.fields([{name: "Images"}]), parseBody, validateRequest(ServiceValidation.createServiceValidationSchema), ServiceController.createService)

router.get('/', ServiceController.getAllServices)

router.get('/:id', ServiceController.getSingleService)

router.put('/:id', auth('admin'), multerUpload.fields([{name: 'Images'}]), parseBody, validateRequest(ServiceValidation.updateServiceValidationSchema), ServiceController.updateService)

router.delete('/:id', auth('admin'), ServiceController.deleteService)

// slot create route
router.post('/slots', auth('admin'), validateRequest(SlotValidation.createSlotValidationSchema), SlotController.createSlots)

export const ServiceRoutes = router