/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Result_boolean_ } from '../models/Result_boolean_';
import type { Result_List_string_ } from '../models/Result_List_string_';
import type { Result_List_SubmissionVO_ } from '../models/Result_List_SubmissionVO_';
import type { Result_long_ } from '../models/Result_long_';
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
     * @param language
     * @param limit
     * @param offset
     * @param problemId
     * @param status
     * @param userId
     * @returns Result_List_SubmissionVO_ OK
     * @throws ApiError
     */
    public static listSubmissionsUsingGet(
        contestId?: number,
        language?: string,
        limit?: number,
        offset?: number,
        problemId?: number,
        status?: string,
        userId?: number,
    ): CancelablePromise<Result_List_SubmissionVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/submission/list',
            query: {
                'contestId': contestId,
                'language': language,
                'limit': limit,
                'offset': offset,
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
}
