import { Router } from 'express';
import { createAdmin } from '../controller/admins/createAdmin';
import { isAdmin } from '../middlewares/isAdmin';
import { authMethods } from '../middlewares/auth';
import { createMovie, createMovieValidated } from '../controller/admins/createMovie';
import { updateMovie, updateMovieValidated } from '../controller/admins/updateMovie';
import { deleteMovieValidated, deleteMovie } from '../controller/admins/deleteMovie';
import { globalLimiter } from '../middlewares/rateLimit';


const router = Router();

router.use(globalLimiter);

router.use(authMethods.isAuthenicated);
router.use(isAdmin);

router.post('/create/admin', createAdmin);
router.post('/create/movie', createMovieValidated, createMovie);
router.put('/update/movie', updateMovieValidated, updateMovie);
router.delete('/delete/movie/:id', deleteMovieValidated, deleteMovie);

export const AdminRoutes: Router = router;
