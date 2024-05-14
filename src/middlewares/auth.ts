import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { client } from '../database/client';
import { IAuthRequest } from '../types/authRequest';

dotenv.config();
const JWTSecret = process.env.JWT_SECRET;

type TokenPayload = {
    id: string;
};


const generateJWT = (payload: TokenPayload): String =>
    jwt.sign(payload, JWTSecret as string, { expiresIn: '7d' });

const isAuthenicated = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const token = request.headers.authorization;
        if (!token) {
            return response
                .status(401)
                .json({ error: 'Unauthorized: Token not provided' });
        }

        const payload: TokenPayload = jwt.verify(
            token,
            JWTSecret as string
        ) as TokenPayload;

        const existingUser = await client.user.findUnique({
            where: {
                id: payload.id,
            },
        });

        if (!existingUser) {
            return response.status(400).json({ error: 'User not found' });
        }

        const authRequest = request as IAuthRequest;
        authRequest.user = existingUser;
        authRequest.role = existingUser.role;

        next();
    } catch (error) {
        return response.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

export const authMethods = {
    generateJWT,
    isAuthenicated,
};
