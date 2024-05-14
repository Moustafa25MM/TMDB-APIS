import { Request, Response, NextFunction } from 'express';
import { fetchMovieDetails, searchMoviesByTitle } from "../../services/tmdbService";
import { HttpException, NOT_FOUND, SERVER_ERROR } from '../../core/exceptions';
import { z } from 'zod';
import requestHandler from '../../core/handlers/requestHandler';
import { validationHandler } from '../../core/handlers/validationHandler';

const movieDetailsParamsSchema = z.object({
    title: z.string().min(1, "Title must not be empty")
});

export const getMovieDetailsByTitle = async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.params;

    try {
        const searchedMovie = await searchMoviesByTitle(title);
        if (!searchedMovie) {
            return res.status(404).send({ message: 'Movie not found' });
        }

        const movieDetails = await fetchMovieDetails(searchedMovie.id);
        return requestHandler.sendSuccess(res)({
            movie: movieDetails
        });
    } catch (error) {
        console.error('Failed to fetch movie details:', error);
        next(new HttpException(SERVER_ERROR, { message: 'Failed to fetch movie details' }));
    }
};

export const getMovieDetailsValidated = validationHandler({
    params: movieDetailsParamsSchema,
});