import { Request, Response, NextFunction } from 'express';
import { HttpException, SERVER_ERROR } from '../core/exceptions';
import logger from '../utils/logger';

export default function exceptionHandler(
    err: HttpException,
    _req: Request,
    res: Response,
    _next: NextFunction,
): Response {
    const { errors, status = SERVER_ERROR, stack } = err;
    let message = err.message === '' ? undefined : err.message;
    if (status >= SERVER_ERROR) {
        message = 'Internal server error';
        logger.error(stack);
    }
    return res.status(status).json({ message, errors });
}
