import fs from 'fs';
import csv from 'csv-parser';
import { client } from '../database/client';
import path from 'path';
import { Movie } from '../types/Movie';
import logger from '../utils/logger';

export const importMovies = async (): Promise<void> => {
    const filePath = path.join(__dirname, '../../data/1000GreatestFilms.csv');
    const moviesToImport: { movieData: Movie, genreNames: string[] }[] = [];
    let processedCount = 0;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            const { Title, Director, Year, Country, Length, Genre, Colour } = data;
            const genreNames: string[] = Genre.split('-').map((genre: any) => genre.trim());

            moviesToImport.push({
                movieData: {
                    title: Title,
                    director: Director,
                    year: parseInt(Year, 10),
                    country: Country,
                    length: parseInt(Length, 10),
                    colour: Colour,
                    genres: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                genreNames: genreNames
            });
        })
        .on('end', async () => {
            logger.info('Starting the import of movies...');
            try {
                for (const { movieData, genreNames } of moviesToImport) {
                    const createdMovie = await client.movie.create({
                        data: {
                            title: movieData.title,
                            director: movieData.director,
                            year: movieData.year,
                            country: movieData.country,
                            length: movieData.length,
                            colour: movieData.colour,
                            createdAt: movieData.createdAt,
                            updatedAt: movieData.updatedAt
                        }
                    });

                    for (const genreName of genreNames) {
                        const genre = await client.genre.upsert({
                            where: { name: genreName },
                            update: {},
                            create: { name: genreName }
                        });

                        await client.movieGenre.create({
                            data: {
                                movieId: createdMovie.id,
                                genreId: genre.id
                            }
                        });
                    }
                    processedCount++;
                    if (processedCount % 100 === 0 || processedCount === moviesToImport.length) {
                        logger.info(`Processed ${processedCount}/${moviesToImport.length} movies.`);
                    }
                }
                logger.info('Movies have been successfully imported.');
            } catch (error) {
                logger.error('Failed to import movies:', error);
            } finally {
                await client.$disconnect();
            }
        });
};