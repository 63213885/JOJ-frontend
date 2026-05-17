/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateProblemRequest } from '../models/CreateProblemRequest';
import type { Result_List_ProblemVO_ } from '../models/Result_List_ProblemVO_';
import type { Result_long_ } from '../models/Result_long_';
import type { Result_ProblemVO_ } from '../models/Result_ProblemVO_';
import type { Result_Void_ } from '../models/Result_Void_';
import type { UpdateProblemRequest } from '../models/UpdateProblemRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProblemControllerService {
    /**
     * createProblem
     * @param createProblemRequest createProblemRequest
     * @returns Result_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static createProblemUsingPost(
        createProblemRequest: CreateProblemRequest,
    ): CancelablePromise<Result_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/problem',
            body: createProblemRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getProblemList
     * @param limit limit
     * @param offset offset
     * @returns Result_List_ProblemVO_ OK
     * @throws ApiError
     */
    public static getProblemListUsingGet(
        limit: number = 50,
        offset?: number,
    ): CancelablePromise<Result_List_ProblemVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/problem/list',
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getProblemById
     * @param id id
     * @returns Result_ProblemVO_ OK
     * @throws ApiError
     */
    public static getProblemByIdUsingGet(
        id: number,
    ): CancelablePromise<Result_ProblemVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/problem/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateProblem
     * @param id id
     * @param updateProblemRequest updateProblemRequest
     * @returns Result_Void_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateProblemUsingPut(
        id: number,
        updateProblemRequest: UpdateProblemRequest,
    ): CancelablePromise<Result_Void_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/problem/{id}',
            path: {
                'id': id,
            },
            body: updateProblemRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * deleteProblem
     * @param id id
     * @returns Result_Void_ OK
     * @throws ApiError
     */
    public static deleteProblemUsingDelete(
        id: number,
    ): CancelablePromise<Result_Void_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/problem/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
}
