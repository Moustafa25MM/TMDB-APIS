
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { client } from '../../database/client';
import requestHandler from '../../core/handlers/requestHandler';
import { HttpException, SERVER_ERROR } from '../../core/exceptions';
import { validationHandler } from '../../core/handlers/validationHandler';

const deleteMovieSchema = z.object({
    id: z.string(),
});

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid movie ID" });
    }

    try {
        const existingMovie = await client.movie.findUnique({ where: { id } });
        if (!existingMovie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        await client.movieGenre.deleteMany({
            where: { movieId: id }
        });

        const deletetMovie = await client.movie.delete({
            where: { id }
        });

        return requestHandler.sendSuccess(res, "Movie deleted successfully", 200)({
            deletetMovie,
        });

    } catch (error) {
        console.error("Failed to delete movie:", error);
        next(new HttpException(SERVER_ERROR, { message: 'Failed to delete movie' }));
    }
};

export const deleteMovieValidated = validationHandler({
    params: deleteMovieSchema,
});
