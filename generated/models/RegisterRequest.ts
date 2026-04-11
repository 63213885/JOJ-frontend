/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterRequest = {
    account?: string;
    agreeTerms?: boolean;
    checkPassword?: string;
    code?: string;
    identifier?: string;
    identifierType?: RegisterRequest.identifierType;
    password?: string;
};
export namespace RegisterRequest {
    export enum identifierType {
        PHONE = 'PHONE',
        EMAIL = 'EMAIL',
    }
}

