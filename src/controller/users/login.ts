import { Request, Response, NextFunction } from 'express';
import { client } from '../../database/client';
import { BAD_REQUEST, HttpException, SERVER_ERROR } from '../../core/exceptions';
import requestHandler from '../../core/handlers/requestHandler';
import { isCorrectPassword } from '../../lib/password';
import { authMethods } from '../../middlewares/auth';
import { z } from 'zod';


export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { username, password } = request.body;

        const user = await client.user.findUnique({
            where: { username }
        });

        if (!user) {
            return next(new HttpException(BAD_REQUEST, { message: 'Invalid username or password' }));
        }

        const isPasswordValid = await isCorrectPassword(password, user.password);

        if (!isPasswordValid) {
            return next(new HttpException(BAD_REQUEST, { message: 'Invalid username or password' }));
        }

        const token = authMethods.generateJWT({ id: user.id });

        return requestHandler.sendSuccess(response, 'Login successful', 200)({ token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        next(new HttpException(SERVER_ERROR, { message: 'Server error during login' }));
    }
};