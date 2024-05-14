import express, { Router } from 'express';
import { getAllMovies, getAllMoviesValidated } from '../controller/movies/getAllMovies';

const router = express.Router();

router.get('/get/all', getAllMoviesValidated, getAllMovies);

export const MoivesRoutes: Router = router;
