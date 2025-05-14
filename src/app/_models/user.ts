// src/app/_models/user.ts
export class User {
    id?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
    jwtToken?: string;
    refreshToken?: string;
    isVerified?: boolean;
    acceptTerms?: boolean;
    created?: Date;
    updated?: Date;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}