export type User = {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}

export type UserPayload = User & {
    password: string
}
