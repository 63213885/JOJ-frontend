/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { Result_boolean_ } from '../models/Result_boolean_';
import type { Result_PageResponse_UserVO_ } from '../models/Result_PageResponse_UserVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * createUser
     * @param request request
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createUserUsingPost(
        request: CreateUserRequest,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/create',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUserPage
     * @param current
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @returns Result_PageResponse_UserVO_ OK
     * @throws ApiError
     */
    public static listUserPageUsingGet(
        current?: number,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
    ): CancelablePromise<Result_PageResponse_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/list',
            query: {
                'current': current,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
