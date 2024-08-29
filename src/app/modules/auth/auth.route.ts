import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/auth/signup', validateRequest(UserValidation.createUserValidationSchema), AuthController.signUp)

router.post('/auth/login', validateRequest(AuthValidation.loginValidationSchema), AuthController.login)

router.get('/users', auth('admin'), AuthController.getAllUsers)

router.put('/users/:id', auth('admin'), AuthController.updateUser)

export const AuthRoutes = router