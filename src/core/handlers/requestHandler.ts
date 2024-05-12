import { Response } from 'express';

export interface ErrorResponse extends Error {
    status?: number;
}

class RequestHandler {
    sendSuccess(res: Response, message?: string, status: number = 200) {
        return (data: any, globalData?: any) => {
            res.status(status).json({
                type: 'success',
                message: message || 'Success result',
                data,
                ...globalData,
            });
        };
    }
}

export default new RequestHandler();
