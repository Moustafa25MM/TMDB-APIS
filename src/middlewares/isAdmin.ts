import { Request, Response, NextFunction } from 'express';
import { FORBIDDEN } from '../core/exceptions';
import { IAuthRequest } from '../types/authRequest';
import { UserRole } from '../types/roles';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authRequest = req as IAuthRequest;

    if (authRequest.role === UserRole.ADMIN) {
        next();
    } else {
        res.status(FORBIDDEN).json({
            error: 'Forbidden: Requires admin role'
        });
    }
};
