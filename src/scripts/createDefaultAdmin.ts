import { client } from "../database/client";
import { hashPassword } from "../lib/password";
import { UserRole } from "../types/roles";
import logger from "../utils/logger";

export const createDefaultAdmin = async () => {
    const defaultAdmin = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password',
        role: UserRole.ADMIN
    };

    const adminExists = await client.user.findFirst({ where: { role: UserRole.ADMIN } });
    if (!adminExists) {
        logger.info(`Creating a default admin with username: ${defaultAdmin.username} and email: ${defaultAdmin.email} and password: ${defaultAdmin.password}`);
        defaultAdmin.password = await hashPassword(defaultAdmin.password);
        await client.user.create({
            data: defaultAdmin
        });
    } else {
        logger.info('Admin already exists.');
    }
}