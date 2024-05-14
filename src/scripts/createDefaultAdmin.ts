import { client } from "../database/client";
import { hashPassword } from "../lib/password";
import { UserRole } from "../types/roles";

export const createDefaultAdmin = async () => {
    const defaultAdmin = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password',
        role: UserRole.ADMIN
    };

    const adminExists = await client.user.findFirst({ where: { role: UserRole.ADMIN } });
    if (!adminExists) {
        defaultAdmin.password = await hashPassword(defaultAdmin.password);
        await client.user.create({
            data: defaultAdmin
        });
        console.log('Default admin created successfully.');
    } else {
        console.log('Admin already exists.');
    }
}