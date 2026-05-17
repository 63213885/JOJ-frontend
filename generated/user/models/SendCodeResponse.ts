/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SendCodeResponse = {
    expireSeconds?: number;
    identifier?: string;
    scene?: SendCodeResponse.scene;
};
export namespace SendCodeResponse {
    export enum scene {
        REGISTER = 'REGISTER',
        LOGIN = 'LOGIN',
        RESET_PASSWORD = 'RESET_PASSWORD',
    }
}

