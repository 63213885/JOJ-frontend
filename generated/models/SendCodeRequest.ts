/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendCodeRequest = {
    account?: string;
    identifier?: string;
    identifierType?: SendCodeRequest.identifierType;
    scene?: SendCodeRequest.scene;
};
export namespace SendCodeRequest {
    export enum identifierType {
        PHONE = 'PHONE',
        EMAIL = 'EMAIL',
    }
    export enum scene {
        REGISTER = 'REGISTER',
        LOGIN = 'LOGIN',
        RESET_PASSWORD = 'RESET_PASSWORD',
    }
}

