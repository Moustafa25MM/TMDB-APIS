import { Request, Response, NextFunction } from 'express';
import { client } from '../../database/client';
import requestHandler from '../../core/handlers/requestHandler';
import HttpException from '../../core/exceptions/HttpException';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../../core/exceptions';
import { IAuthRequest } from '../../types/authRequest';
import { z } from 'zod';
import { validationHandler } from '../../core/handlers/validationHandler';
import { fetchMovieDetails, searchMoviesByTitle } from '../../services/tmdbService';

const addToFavSchema = z.object({
    movieId: z.number(),
});

export const addToFavorites = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const { movieId } = req.body;
    const userId = req?.user?.id;
    if (!userId) {
        return next(new HttpException(BAD_REQUEST, { message: 'User ID is missing' }));
    }
    try {

        let movie = await client.movie.findUnique({
            where: { id: movieId },
        });

        if (!movie) {
            return next(new HttpException(BAD_REQUEST, { message: 'Movie not found in the database' }));
        }

        if (!movie.tmdbId) {
            const searchedMovie = await searchMoviesByTitle(movie.title);
            if (!searchedMovie) {
                return next(new HttpException(BAD_REQUEST, { message: 'Movie not found on TMDB' }));
            }

            const movieDetails = await fetchMovieDetails(searchedMovie.id.toString());
            movie = await client.movie.update({
                where: { id: movieId },
                data: {
                    tmdbId: movieDetails.id,
                    posterPath: movieDetails.poster_path,
                    description: movieDetails.overview,
                },
            });
        }


        // Add to favorites
        const favoriteEntry = await client.favorite.create({
            data: {
                userId,
                movieId
            },
            include: {
                movie: true
            }
        });

        return requestHandler.sendSuccess(res, "Movie added to your Favoites successfully.", 201)({
            favoriteEntry
        });

    } catch (error) {
        console.error("Failed to add movie to favorites:", error);
        next(new HttpException(SERVER_ERROR, { message: 'Failed to add movie to favorites' }));
    }
};

export const addMovieToFavValidated = validationHandler({
    body: addToFavSchema,
});