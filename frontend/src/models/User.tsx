

export interface User{
    id: string;
    username: string;
    email: string;
    bio: string;
    profilePhoto: string;
    createdAt: Date;
    verificationCode: string;
    verificationCodeExpiresAt: Date;
    verified: boolean;
    active: boolean;
}

export interface loginResponse{
    token: string;
    expiresIn: number;
}

export interface tokenResponse{
    sub: string;
    email: string;
    username: string;
}