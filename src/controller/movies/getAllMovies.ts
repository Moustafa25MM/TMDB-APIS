import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { paginationOption } from '../../lib/pagination';
import requestHandler from '../../core/handlers/requestHandler';
import HttpException from '../../core/exceptions/HttpException';
import { validationHandler } from '../../core/handlers/validationHandler';
import { client } from '../../database/client';
import { SERVER_ERROR } from '../../core/exceptions';
import { redisClient } from '../../config/redisClient';

const movieQuerySchema = z.object({
    title: z.string().optional(),
    director: z.string().optional(),
    genre: z.string().optional(),
    year: z.string().optional(),
    page: z.string().min(1).optional(),
    pageSize: z.string().min(1).optional(),
});

export const getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const baseKey = 'movies:';
        const queryKey = `${baseKey}${JSON.stringify(req.query)}`;

        const cachedMovies = await redisClient.get(queryKey);
        if (cachedMovies) {
            return requestHandler.sendSuccess(res, "Movies fetched from cache", 200)(JSON.parse(cachedMovies));
        }


        const whereCondition: any = {
            ...(req.query.title && { title: { contains: req.query.title as string, mode: 'insensitive' as any } }),
            ...(req.query.director && { director: { contains: req.query.director as string, mode: 'insensitive' as any } }),
            ...(req.query.year && { year: parseInt(req.query.year as string) }),
            ...(req.query.genre && { genres: { some: { genre: { name: { equals: req.query.genre as string, mode: 'insensitive' as any } } } } }),
        };

        const totalDocs = await client.movie.count({ where: whereCondition });
        const movies = await client.movie.findMany({
            where: whereCondition,
            include: {
                genres: {
                    select: { genre: { select: { name: true } } }
                }
            },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        const paginationOptions = paginationOption(pageSize, page, totalDocs);

        const result = {
            pagination: paginationOptions,
            movies,
        };

        await redisClient.set(queryKey, JSON.stringify(result), 'EX', 3600);

        return requestHandler.sendSuccess(res, "Movies fetched successfully", 200)(result);

    } catch (error) {
        res.status(SERVER_ERROR).json({ message: 'Failed to fetch movies' })
    }
}
export const getAllMoviesValidated = validationHandler({
    query: movieQuerySchema,
});