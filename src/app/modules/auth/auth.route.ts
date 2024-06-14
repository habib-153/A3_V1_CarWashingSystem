import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post('/signup', validateRequest(UserValidation.createUserValidationSchema), AuthController.signUp)

router.post('/login', validateRequest(AuthValidation.loginValidationSchema), AuthController.login)

export const AuthRoutes = router