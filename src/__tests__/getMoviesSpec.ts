import { app } from "..";
import { redisClient } from "../config/redisClient";
import { client } from "../database/client";

import request from 'supertest';

describe('GET /movies', () => {
    beforeEach(() => {
        spyOn(redisClient, 'get').and.callFake(() => Promise.resolve(null));
        spyOn(redisClient, 'set').and.callFake(() => Promise.resolve('OK'));
    });

    it('should fetch movies from the database if not cached', async () => {
        const mockMovies = [{ id: 1, title: 'Inception', director: 'Christopher Nolan' }];
        const mockCount = 1;

        spyOn(client.movie, 'count').and.callFake(() => Promise.resolve(mockCount));
        spyOn(client.movie, 'findMany').and.callFake(() => Promise.resolve(mockMovies));

        const response = await request(app).get('/movies/get/all?page=1&pageSize=10');

        expect(response.status).toBe(200);
        expect(response.body.data.movies).toEqual(mockMovies);
        expect(response.body.data.pagination).toBeDefined();

        expect(redisClient.get).toHaveBeenCalled();
        expect(redisClient.set).toHaveBeenCalled();
    });
});