/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PasswordResetRequest = {
    account?: string;
    code?: string;
    confirmPassword?: string;
    identifier?: string;
    identifierType?: PasswordResetRequest.identifierType;
    newPassword?: string;
};
export namespace PasswordResetRequest {
    export enum identifierType {
        PHONE = 'PHONE',
        EMAIL = 'EMAIL',
    }
}

