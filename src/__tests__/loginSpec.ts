import request from 'supertest';
import { app } from '../index';
import { client } from '../database/client';

describe('Login Endpoint', () => {
    const userCredentials = {
        username: 'UniqueUser123',
        password: 'securePassword123',
    };

    it('should successfully log in with valid credentials', async () => {
        const loginCredentials = {
            username: userCredentials.username,
            password: userCredentials.password,
        };

        await request(app)
            .post('/auth/register')
            .send(userCredentials)

        const response = await request(app)
            .post('/auth/login')
            .send(loginCredentials)
            .expect(200);

        expect(response.body.message).toBe('Login successful');
    });


    it('should fail to log in with non-existent username', async () => {
        const credentials = {
            username: 'nonexistent',
            password: 'password',
        };

        const response = await request(app)
            .post('/auth/login')
            .send(credentials)
            .expect(400);

        expect(response.body.message).toBe('Invalid username or password');
    });

    it('should handle server error during login', async () => {
        const credentials = {
            username: 'Test User',
            password: 'password',
        };

        spyOn(client.user, 'findUnique').and.throwError(new Error('Database failure'));

        const response = await request(app)
            .post('/auth/login')
            .send(credentials);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error during user login');
    });
});