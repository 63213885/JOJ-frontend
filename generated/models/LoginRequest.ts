/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LoginRequest = {
    account?: string;
    code?: string;
    identifier?: string;
    identifierType?: LoginRequest.identifierType;
    password?: string;
};
export namespace LoginRequest {
    export enum identifierType {
        PHONE = 'PHONE',
        EMAIL = 'EMAIL',
    }
}

