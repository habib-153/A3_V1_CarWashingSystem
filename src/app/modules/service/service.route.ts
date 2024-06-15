import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ServiceValidation } from './service.validation';
import { ServiceController } from './service.controller';

const router = express.Router();

router.post('/', auth('admin'), validateRequest(ServiceValidation.createServiceValidationSchema), ServiceController.createService)

router.get('/', ServiceController.getAllServices)

router.get('/:id', ServiceController.getSingleService)

router.put('/:id', auth('admin'), validateRequest(ServiceValidation.updateServiceValidationSchema), ServiceController.updateService)

router.delete('/:id', auth('admin'), ServiceController.deleteService)

export const ServiceRoutes = router