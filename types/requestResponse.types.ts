// Types related to request -> response cycle

import type { ValidationError } from "express-validator";

export interface ILoginUserRequestBody {
    firstName: string;
    lastName?: string;
    username: string;
    email: string;
    password: string;
}

export interface GenericSuccessResponse {
    success: boolean;
    message?: string;
    error?: ValidationError
}

export interface ILoginUserResponse extends GenericSuccessResponse {}