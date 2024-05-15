import { Router } from 'express';
import { register, registrationSchema } from '../controller/users/register';
import { login, loginSchema } from '../controller/users/login';

import { validationHandler } from '../core/handlers/validationHandler';
import { sensitiveLimiter } from '../middlewares/rateLimit';

const registrationValidationRules = {
    body: registrationSchema,
};

const loginValidationRules = {
    body: loginSchema,
};


const router = Router();

router.post('/register', validationHandler(registrationValidationRules), register);
router.post('/login', sensitiveLimiter, validationHandler(loginValidationRules), login);

export const AuthRoutes: Router = router;
