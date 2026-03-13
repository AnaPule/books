

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
    exp: number;
    email: string;
    username:string;
}
export interface SignUpForm{
    email: string;
    password: string;
    username: string;
    accept: boolean;
}
export interface LoginForm{
    email: string;
    password: string;
}