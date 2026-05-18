/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Result_boolean_ } from '../models/Result_boolean_';
import type { Result_Map_string_boolean_ } from '../models/Result_Map_string_boolean_';
import type { Result_PageResponse_UserVO_ } from '../models/Result_PageResponse_UserVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RelationControllerService {
    /**
     * follow
     * @param toUserId toUserId
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static followUsingPost(
        toUserId: number,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/relation/follow',
            query: {
                'toUserId': toUserId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * followers
     * @param userId userId
     * @param current
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @returns Result_PageResponse_UserVO_ OK
     * @throws ApiError
     */
    public static followersUsingGet(
        userId: number,
        current?: number,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
    ): CancelablePromise<Result_PageResponse_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/relation/followers',
            query: {
                'current': current,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * following
     * @param userId userId
     * @param current
     * @param pageSize
     * @param sortField
     * @param sortOrder
     * @returns Result_PageResponse_UserVO_ OK
     * @throws ApiError
     */
    public static followingUsingGet(
        userId: number,
        current?: number,
        pageSize?: number,
        sortField?: string,
        sortOrder?: string,
    ): CancelablePromise<Result_PageResponse_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/relation/following',
            query: {
                'current': current,
                'pageSize': pageSize,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * status
     * @param toUserId toUserId
     * @returns Result_Map_string_boolean_ OK
     * @throws ApiError
     */
    public static statusUsingGet(
        toUserId: number,
    ): CancelablePromise<Result_Map_string_boolean_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/relation/status',
            query: {
                'toUserId': toUserId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * unfollow
     * @param toUserId toUserId
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static unfollowUsingPost(
        toUserId: number,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/relation/unfollow',
            query: {
                'toUserId': toUserId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
