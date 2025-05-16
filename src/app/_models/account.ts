import { Role } from './role';

export class Account {
    id?: string;
    title?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: Role; 
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