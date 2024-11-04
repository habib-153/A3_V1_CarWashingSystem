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
router.get('/stats', auth('user', 'admin'), AuthController.getUserStats)

router.get('/users/:email', auth('user', 'admin'), AuthController.getUserByEmail)
router.put('/users/:id', auth('admin', 'user'), AuthController.updateUser)

export const AuthRoutes = router