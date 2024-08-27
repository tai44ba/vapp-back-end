import {Router} from 'express';
import { login, register, verifyAccount } from '../controllers/users.controller.js';
import { loginValidator, registerValidator } from '../validations/users.validation.js';
import { handleValidationResults } from '../middleware/handleValidationResult.js';

const userRouter = Router()

userRouter.route('/register').post(registerValidator, handleValidationResults, register)
userRouter.route('/login').post(loginValidator, login)
userRouter.route('/verify/:vToken/:uid').get(verifyAccount);

export default userRouter 