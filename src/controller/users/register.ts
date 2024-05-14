import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, FORBIDDEN, HttpException, SERVER_ERROR } from "../../core/exceptions";
import { client } from "../../database/client";
import { hashPassword } from "../../lib/password";
import requestHandler from "../../core/handlers/requestHandler";
import { z } from 'zod';

interface RegistrationRequestBody {
    username: string;
    email: string;
    password: string;
}

export const registrationSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export const register = async (request: Request, response: Response, next: NextFunction) => {

    try {
        const { username, email, password }: RegistrationRequestBody = request.body;

        const existingUsername = await client.user.findFirst({
            where: { username }
        });

        const existingEmail = await client.user.findFirst({
            where: { email }
        });

        let errorDetails = [];
        if (existingUsername) {
            errorDetails.push('Username already exists');
        }
        if (existingEmail) {
            errorDetails.push('Email already exists');
        }

        if (errorDetails.length > 0) {
            return next(new HttpException(FORBIDDEN, { message: errorDetails.join(' and ') }));
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await client.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        return requestHandler.sendSuccess(response, 'User created successfully', 201)({ user: newUser });
    } catch (error) {
        console.error('Error during registration:', error);
        next(new HttpException(SERVER_ERROR, { message: 'Server error during user registration' }));
    }
};