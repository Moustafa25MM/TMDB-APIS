import express, { Router } from 'express';
import { getAllMovies, getAllMoviesValidated } from '../controller/movies/getAllMovies';
import { getMovieDetailsByTitle, getMovieDetailsValidated } from '../controller/movies/getMovieDetails';
import { authMethods } from '../middlewares/auth';
import { isUser } from '../middlewares/isUser';
import { addMovieToWatchlistValidated, addToWatchlist } from '../controller/movies/userAddMovieToWatchlist';

const router = express.Router();

router.get('/get/all', getAllMoviesValidated, getAllMovies);
router.get('/details/:title', getMovieDetailsValidated, getMovieDetailsByTitle);

router.post('/add/to/watchlist',
    authMethods.isAuthenicated,
    isUser,
    addMovieToWatchlistValidated,
    addToWatchlist);


export const MoivesRoutes: Router = router;
