import { Router } from 'express';
import { register } from '../controller/users/register';

import { validationHandler } from '../core/handlers/validationHandler';
import { registrationSchema } from '../controller/users/register';

const registrationValidationRules = {
    body: registrationSchema,
};

const router = Router();

router.post('/register', validationHandler(registrationValidationRules), register);

export const AuthRoutes: Router = router;
