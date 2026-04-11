/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegisterRequest } from '../models/RegisterRequest';
import type { Result_long_ } from '../models/Result_long_';
import type { Result_SendCodeResponse_ } from '../models/Result_SendCodeResponse_';
import type { Result_string_ } from '../models/Result_string_';
import type { SendCodeRequest } from '../models/SendCodeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthControllerService {
    /**
     * ok
     * @returns Result_string_ OK
     * @throws ApiError
     */
    public static okUsingGet(): CancelablePromise<Result_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/ok',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * register
     * @param registerRequest registerRequest
     * @returns Result_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static registerUsingPost(
        registerRequest: RegisterRequest,
    ): CancelablePromise<Result_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/register',
            body: registerRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * sendCode
     * @param request request
     * @returns Result_SendCodeResponse_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static sendCodeUsingPost(
        request: SendCodeRequest,
    ): CancelablePromise<Result_SendCodeResponse_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/send-code',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
