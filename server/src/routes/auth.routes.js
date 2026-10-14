import { Router } from 'express';
import { register, login, me, updateMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema, updateMeSchema } from '../validators/auth.validators.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), asyncHandler(register));
authRouter.post('/login', validate(loginSchema), asyncHandler(login));
authRouter.get('/me', authenticate, asyncHandler(me));
authRouter.patch('/me', authenticate, validate(updateMeSchema), asyncHandler(updateMe));
