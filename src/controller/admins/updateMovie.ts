import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { client } from '../../database/client';
import requestHandler from '../../core/handlers/requestHandler';
import { HttpException, SERVER_ERROR } from '../../core/exceptions';
import { validationHandler } from '../../core/handlers/validationHandler';
import logger from '../../utils/logger';


const updateMovieSchema = z.object({
    id: z.number(),
    title: z.string().optional(),
    director: z.string().optional(),
    year: z.number().min(1900).max(new Date().getFullYear()).optional(),
    country: z.string().optional(),
    length: z.number().positive().optional(),
    colour: z.string().optional(),
    genres: z.array(z.number()).optional()
});


export const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
    const { id, title, director, year, country, length, colour, genres } = req.body;

    try {
        const existingMovie = await client.movie.findUnique({
            where: { id },
            include: {
                genres: true
            }
        });

        if (!existingMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        // Prepare update data for non-genre fields
        const updateData: any = {
            title,
            director,
            year,
            country,
            length,
            colour
        };

        await client.movie.update({
            where: { id },
            data: updateData
        });

        // Handle genre updates separately if genres are provided
        if (genres) {
            // Detach all existing genres first
            await client.movieGenre.deleteMany({
                where: { movieId: id }
            });

            // Attach new genres
            for (const genreId of genres) {
                await client.movieGenre.create({
                    data: {
                        movieId: id,
                        genreId: genreId
                    }
                });
            }
        }

        // Fetch the updated movie with genre details
        const updatedMovie = await client.movie.findUnique({
            where: { id },
            include: {
                genres: {
                    include: {
                        genre: true
                    }
                }
            }
        });

        return requestHandler.sendSuccess(res, "Movie updated successfully", 200)({
            movie: updatedMovie
        });

    } catch (error) {
        logger.error("Failed to update movie:", error);
        next(new HttpException(SERVER_ERROR, { message: 'Failed to update movie' }));
    }
};
export const updateMovieValidated = validationHandler({
    body: updateMovieSchema,
});