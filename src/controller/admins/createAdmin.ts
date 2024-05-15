import { Request, Response, NextFunction } from 'express';
import { client } from '../../database/client';
import { hashPassword } from '../../lib/password';
import { HttpException, SERVER_ERROR, FORBIDDEN } from '../../core/exceptions';
import requestHandler from '../../core/handlers/requestHandler';
import logger from '../../utils/logger';

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { username, email, password } = req.body;

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

        const newAdmin = await client.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        return requestHandler.sendSuccess(res, 'Admin created successfully', 201)({ user: newAdmin });
    } catch (error) {
        logger.error('Error during admin creation:', error);
        next(new HttpException(SERVER_ERROR, { message: 'Server error during admin creation' }));
    }
};