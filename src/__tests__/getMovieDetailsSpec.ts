import { app } from '..';
import { redisClient } from '../config/redisClient';
import { fetchMovieDetails, searchMoviesByTitle } from '../services/tmdbService';

import request from 'supertest';

const tmdbService = {
    searchMoviesByTitle,
    fetchMovieDetails
};

describe('GET /movies/details/:title', () => {
    const title = "Citizen";
    const cacheKey = `movieDetails:${title}`;
    const mockMovie = { id: 1, title: 'Citizen', director: 'Christopher Nolan' };
    const movieDetails = { id: 1, detail: 'Some movie details here...' };

    beforeEach(() => {
        spyOn(redisClient, 'get').and.callFake((key) => {
            if (key === `movieDetails:${title}`) {
                return Promise.resolve(JSON.stringify(mockMovie));
            }
            return Promise.resolve(null);
        });
        spyOn(redisClient, 'setex').and.callFake(() => Promise.resolve());
    });


    it('should fetch movie details from the API if not cached', async () => {
        const response = await request(app).get(`/movies/details/${title}`);

        expect(response.status).toBe(200);
    });

    it('should return 404 if movie is not found', async () => {

        const response = await request(app).get(`/movies/details/asdasdasdasd`);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Movie not found' });
    });

});