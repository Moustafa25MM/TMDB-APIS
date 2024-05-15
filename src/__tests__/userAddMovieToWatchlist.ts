// tests/user.test.ts
import request from 'supertest';
import { app } from '..';

describe('User Authentication and Watchlist Management', () => {
    let token: string;
    const testUser = {
        username: 'testuser12',
        password: 'testpassword'
    };
    const testMovieId = 17584;

    beforeAll(async () => {
        await request(app)
            .post('/auth/register')
            .send(testUser)
            .expect(201);

        const loginResponse = await request(app)
            .post('/auth/login')
            .send(testUser);

        expect(loginResponse.status).toBe(200);
        token = loginResponse.body.data.token;
    });

    it('should add a movie to the user\'s watchlist', async () => {
        const response = await request(app)
            .post('/movies/add/to/watchlist')
            .set('Authorization', `${token}`)
            .send({ movieId: testMovieId });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Movie added to watchlist successfully.');
        expect(response.body.data.watchlistEntry.movieId).toBe(testMovieId);
    });
});