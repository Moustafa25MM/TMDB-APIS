import express, { Router } from 'express';
import { getAllMovies, getAllMoviesValidated } from '../controller/movies/getAllMovies';
import { getMovieDetailsByTitle, getMovieDetailsValidated } from '../controller/movies/getMovieDetails';

const router = express.Router();

router.get('/get/all', getAllMoviesValidated, getAllMovies);
router.get('/details/:title', getMovieDetailsValidated, getMovieDetailsByTitle);

export const MoivesRoutes: Router = router;
