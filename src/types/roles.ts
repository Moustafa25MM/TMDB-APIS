export const UserRole: {
    USER: 'USER'
    ADMIN: 'ADMIN'
} = {
    USER: 'USER',
    ADMIN: 'ADMIN',
}

export type UserRole = typeof UserRole[keyof typeof UserRole]