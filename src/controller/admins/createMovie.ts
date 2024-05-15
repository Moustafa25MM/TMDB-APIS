import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { client } from '../../database/client';
import requestHandler from '../../core/handlers/requestHandler';
import { HttpException, SERVER_ERROR } from '../../core/exceptions';
import { validationHandler } from '../../core/handlers/validationHandler';


const createMovieSchema = z.object({
    title: z.string(),
    director: z.string(),
    year: z.number().min(1900).max(new Date().getFullYear()),
    country: z.string(),
    length: z.number().positive(),
    colour: z.string(),
    genres: z.array(z.number()).optional()
});


export const createMovie = async (req: Request, res: Response, next: NextFunction) => {
    const { title, director, year, country, length, colour, genres } = req.body;

    try {
        const movie = await client.movie.create({
            data: {
                title,
                director,
                year,
                country,
                length,
                colour,
                genres: {
                    create: genres.map((genreId: number) => ({
                        genre: {
                            connect: { id: genreId }
                        }
                    }))
                }
            },
            include: {
                genres: {
                    include: {
                        genre: true
                    }
                }
            }
        });

        return requestHandler.sendSuccess(res, "Movie created successfully", 201)({
            movie
        });

    } catch (error) {
        return res.status(SERVER_ERROR).json({ message: 'Failed to create movie' });
    }
};

export const createMovieValidated = validationHandler({
    body: createMovieSchema,
});