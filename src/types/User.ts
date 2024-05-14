import { UserRole } from "./roles";

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    password: String;
}