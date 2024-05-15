import { Request, Response, NextFunction } from 'express';
import { fetchMovieDetails, searchMoviesByTitle } from "../../services/tmdbService";
import { HttpException, NOT_FOUND, SERVER_ERROR } from '../../core/exceptions';
import { z } from 'zod';
import requestHandler from '../../core/handlers/requestHandler';
import { validationHandler } from '../../core/handlers/validationHandler';
import { redisClient } from '../../config/redisClient';

const movieDetailsParamsSchema = z.object({
    title: z.string().min(1, "Title must not be empty")
});

export const getMovieDetailsByTitle = async (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.params;

    try {
        const cacheKey = `movieDetails:${title}`;
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json({
                source: 'cache',
                movie: JSON.parse(cachedData)
            });
        }

        const searchedMovie = await searchMoviesByTitle(title);
        if (!searchedMovie) {
            return res.status(404).send({ message: 'Movie not found' });
        }

        const movieDetails = await fetchMovieDetails(searchedMovie.id);
        await redisClient.setex(cacheKey, 3600, JSON.stringify(movieDetails));

        return requestHandler.sendSuccess(res)({
            source: 'api',
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