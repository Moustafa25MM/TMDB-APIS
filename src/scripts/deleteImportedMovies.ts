import { client } from '../database/client';

export const deleteAllMoviesAndGenres = async (): Promise<void> => {
    try {
        await client.movieGenre.deleteMany({});

        await client.genre.deleteMany({});

        await client.movie.deleteMany({});

        console.log('All movies and genres have been successfully deleted.');
    } catch (error) {
        console.error('Failed to delete movies and genres:', error);
    } finally {
        await client.$disconnect();
    }
};
