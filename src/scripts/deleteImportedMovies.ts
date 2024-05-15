import { client } from '../database/client';
import logger from '../utils/logger';

export const deleteAllMoviesAndGenres = async (): Promise<void> => {
    try {
        await client.movieGenre.deleteMany({});

        await client.genre.deleteMany({});

        await client.movie.deleteMany({});

        logger.info('All movies and genres have been successfully deleted.');
    } catch (error) {
        logger.error('Failed to delete movies and genres:', error);
    } finally {
        await client.$disconnect();
    }
};
