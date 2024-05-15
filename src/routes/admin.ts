import { Router } from 'express';
import { createAdmin } from '../controller/admins/createAdmin';
import { isAdmin } from '../middlewares/isAdmin';
import { authMethods } from '../middlewares/auth';
import { createMovie, createMovieValidated } from '../controller/admins/createMovie';
import { updateMovie, updateMovieValidated } from '../controller/admins/updateMovie';
import { deleteMovieValidated, deleteMovie } from '../controller/admins/deleteMovie';


const router = Router();

router.post('/create/admin', authMethods.isAuthenicated, isAdmin, createAdmin);
router.post('/create/movie', authMethods.isAuthenicated, isAdmin, createMovieValidated, createMovie);
router.put('/update/movie', authMethods.isAuthenicated, isAdmin, updateMovieValidated, updateMovie);
router.delete('/delete/movie/:id', authMethods.isAuthenicated, isAdmin, deleteMovieValidated, deleteMovie);

export const AdminRoutes: Router = router;
