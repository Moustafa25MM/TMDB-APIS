import { Request, Response, NextFunction } from 'express';
import { client } from '../../database/client';
import { hashPassword } from '../../lib/password';
import { HttpException, SERVER_ERROR, FORBIDDEN } from '../../core/exceptions';
import requestHandler from '../../core/handlers/requestHandler';

export const createAdmin = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { username, email, password } = req.body;
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
        console.error('Error during admin creation:', error);
        next(new HttpException(SERVER_ERROR, { message: 'Server error during admin creation' }));
    }
};