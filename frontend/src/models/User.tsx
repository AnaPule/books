
export interface User{
    id: string;
    username: string;
    email: string;
    bio: string;
    cellphone: string;
    profilePhoto: string;
    createdAt: Date;
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
    iat?: number;
}
export interface SignUpForm{
    email: string;
    password: string;
    username: string;
    accept: boolean;
    cellphone: string;
}
export interface LoginForm{
    email: string;
    password: string;
}
