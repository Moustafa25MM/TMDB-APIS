import { Router } from 'express';
import { createAdmin } from '../controller/admins/createAdmin';
import { isAdmin } from '../middlewares/isAdmin';
import { authMethods } from '../middlewares/auth';


const router = Router();

router.post('/create/admin', authMethods.isAuthenicated, isAdmin, createAdmin);

export const AdminRoutes: Router = router;
