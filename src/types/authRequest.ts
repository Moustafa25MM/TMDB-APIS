import { Request } from 'express';
import { UserRole } from "./roles";
import { User } from './User';

export interface IAuthRequest extends Request {
    user?: User;
    role?: UserRole;
}
