import { Request, Response, NextFunction } from 'express';
import { client } from '../../database/client';
import requestHandler from '../../core/handlers/requestHandler';
import HttpException from '../../core/exceptions/HttpException';
import { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } from '../../core/exceptions';
import { z } from 'zod';
import { validationHandler } from '../../core/handlers/validationHandler';
import { IAuthRequest } from '../../types/authRequest';
import { Watchlist } from '../../types/WatchList';
import logger from '../../utils/logger';

const addToWatchlistSchema = z.object({
    movieId: z.number(),
});

export const addToWatchlist = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const { movieId } = req.body;
    const userId = req?.user?.id;
    if (!userId) {
        return next(new HttpException(BAD_REQUEST, { message: 'User ID is missing' }));
    }
    try {
        const watchlistEntry = await client.watchlist.create({
            data: {
                userId,
                movieId
            },
            include: {
                movie: {
                    include: {
                        genres: {
                            include: {
                                genre: true
                            }
                        }
                    }
                }
            }
        });

        if (!watchlistEntry) {
            throw new HttpException(NOT_FOUND, { message: 'Movie not found' });
        }

        // Send successful response
        return requestHandler.sendSuccess(res, "Movie added to watchlist successfully.", 201)({
            watchlistEntry
        });

    } catch (error) {
        logger.error("Failed to add movie to watchlist:", error);
        next(new HttpException(SERVER_ERROR, { message: 'Failed to add movie to watchlist' }));
    }
};

export const addMovieToWatchlistValidated = validationHandler({
    body: addToWatchlistSchema,
});