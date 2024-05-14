import { compare, hash } from 'bcrypt';

export const hashPassword = (password: string): Promise<string> => {
    return hash(password, 10);
}

export const isCorrectPassword = (password: string, hashedPassword: string): Promise<boolean> => {
    return compare(password, hashedPassword);
}