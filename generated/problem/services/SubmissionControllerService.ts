/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Result_boolean_ } from '../models/Result_boolean_';
import type { Result_List_string_ } from '../models/Result_List_string_';
import type { Result_long_ } from '../models/Result_long_';
import type { Result_PageResponse_SubmissionVO_ } from '../models/Result_PageResponse_SubmissionVO_';
import type { Result_SubmissionVO_ } from '../models/Result_SubmissionVO_';
import type { SubmitCodeRequest } from '../models/SubmitCodeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SubmissionControllerService {
    /**
     * submitCode
     * @param submitCodeRequest submitCodeRequest
     * @returns Result_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static submitCodeUsingPost(
        submitCodeRequest: SubmitCodeRequest,
    ): CancelablePromise<Result_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/submission',
            body: submitCodeRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listSupportedLanguages
     * @returns Result_List_string_ OK
     * @throws ApiError
     */
    public static listSupportedLanguagesUsingGet(): CancelablePromise<Result_List_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submission/language/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listSubmissions
     * @param contestId
     * @param current
     * @param language
     * @param pageSize
     * @param problemId
     * @param sortField
     * @param sortOrder
     * @param status
     * @param userId
     * @returns Result_PageResponse_SubmissionVO_ OK
     * @throws ApiError
     */
    public static listSubmissionsUsingGet(
        contestId?: number,
        current?: number,
        language?: string,
        pageSize?: number,
        problemId?: number,
        sortField?: string,
        sortOrder?: string,
        status?: string,
        userId?: number,
    ): CancelablePromise<Result_PageResponse_SubmissionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submission/list',
            query: {
                'contestId': contestId,
                'current': current,
                'language': language,
                'pageSize': pageSize,
                'problemId': problemId,
                'sortField': sortField,
                'sortOrder': sortOrder,
                'status': status,
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
     * rejudgeListSubmissions
     * @param contestId
     * @param language
     * @param problemId
     * @param status
     * @param userId
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static rejudgeListSubmissionsUsingPost(
        contestId?: number,
        language?: string,
        problemId?: number,
        status?: string,
        userId?: number,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/submission/list/rejudge',
            query: {
                'contestId': contestId,
                'language': language,
                'problemId': problemId,
                'status': status,
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
     * listStatus
     * @returns Result_List_string_ OK
     * @throws ApiError
     */
    public static listStatusUsingGet(): CancelablePromise<Result_List_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submission/status',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getSubmission
     * @param id id
     * @returns Result_SubmissionVO_ OK
     * @throws ApiError
     */
    public static getSubmissionUsingGet(
        id: number,
    ): CancelablePromise<Result_SubmissionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submission/{id}',
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
     * deleteSubmission
     * @param id id
     * @returns Result_boolean_ OK
     * @throws ApiError
     */
    public static deleteSubmissionUsingDelete(
        id: number,
    ): CancelablePromise<Result_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/submission/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }
    /**
     * rejudgeSubmission
     * @param id id
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static rejudgeSubmissionUsingPost(
        id: number,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/submission/{id}/rejudge',
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
}
