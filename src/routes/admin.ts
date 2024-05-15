import { Router } from 'express';
import { createAdmin } from '../controller/admins/createAdmin';
import { isAdmin } from '../middlewares/isAdmin';
import { authMethods } from '../middlewares/auth';
import { createMovie, createMovieValidated } from '../controller/admins/createMovie';


const router = Router();

router.post('/create/admin', authMethods.isAuthenicated, isAdmin, createAdmin);
router.post('/create/movie', authMethods.isAuthenicated, isAdmin, createMovieValidated, createMovie);

export const AdminRoutes: Router = router;
