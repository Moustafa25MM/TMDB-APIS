import request from 'supertest';
import { app } from '../index';
import { client } from '../database/client';

describe('Register Endpoint', () => {

    it('should successfully register a new user', async () => {
        const newUser = {
            username: 'UniqueUser123456',
            email: 'UniqueUser123456@example.com',
            password: 'securePassword123',
        };

        const response = await request(app)
            .post('/auth/register')
            .send(newUser)
            .expect(201);

        expect(response.body.message).toBe('User created successfully');
    })

    it('should reject registration with existing username', async () => {
        const newUser = {
            username: 'Test User',
            email: 'uniqueEmail@example.com',
            password: 'password',
        };

        const response = await request(app)
            .post('/auth/register')
            .send(newUser)
            .expect(400);

        expect(response.body.message).toContain('Username already exists');
    });

    it('should reject registration with existing email', async () => {
        const newUser = {
            username: 'UniqueUser',
            email: 'testUser@example.com',
            password: 'password',
        };

        const response = await request(app)
            .post('/auth/register')
            .send(newUser)
            .expect(400);

        expect(response.body.message).toContain('Email already exists');
    });

    it('should handle server error during registration', async () => {
        const newUser = {
            username: 'NewTestUser',
            email: 'newTestUser@example.com',
            password: 'password',
        };

        spyOn(client.user, 'create').and.throwError(new Error('Database failure'));

        const response = await request(app)
            .post('/auth/register')
            .send(newUser);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Server error during user registration');
    });
});