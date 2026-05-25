/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CompleteUploadRequest } from '../models/CompleteUploadRequest';
import type { InitUploadRequest } from '../models/InitUploadRequest';
import type { RecordUploadPartRequest } from '../models/RecordUploadPartRequest';
import type { Result_boolean_ } from '../models/Result_boolean_';
import type { Result_InitUploadVO_ } from '../models/Result_InitUploadVO_';
import type { Result_List_UploadedPartVO_ } from '../models/Result_List_UploadedPartVO_';
import type { Result_long_ } from '../models/Result_long_';
import type { Result_UploadPartUrlVO_ } from '../models/Result_UploadPartUrlVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LargeFileUploadControllerService {
    /**
     * completeUpload
     * @param request request
     * @returns Result_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static completeUploadUsingPost(
        request: CompleteUploadRequest,
    ): CancelablePromise<Result_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/media/upload/video/complete',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * initUpload
     * @param request request
     * @returns Result_InitUploadVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static initUploadUsingPost(
        request: InitUploadRequest,
    ): CancelablePromise<Result_InitUploadVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/media/upload/video/init',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * recordPart
     * @param request request
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static recordPartUsingPost(
        request: RecordUploadPartRequest,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/media/upload/video/part',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * abortUpload
     * @param taskId taskId
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static abortUploadUsingPost(
        taskId: number,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/media/upload/video/{taskId}/abort',
            path: {
                'taskId': taskId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getPartUploadUrl
     * @param partNumber partNumber
     * @param taskId taskId
     * @returns Result_UploadPartUrlVO_ OK
     * @throws ApiError
     */
    public static getPartUploadUrlUsingGet(
        partNumber: number,
        taskId: number,
    ): CancelablePromise<Result_UploadPartUrlVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/media/upload/video/{taskId}/part-url',
            path: {
                'taskId': taskId,
            },
            query: {
                'partNumber': partNumber,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listUploadedParts
     * @param taskId taskId
     * @returns Result_List_UploadedPartVO_ OK
     * @throws ApiError
     */
    public static listUploadedPartsUsingGet(
        taskId: number,
    ): CancelablePromise<Result_List_UploadedPartVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/media/upload/video/{taskId}/parts',
            path: {
                'taskId': taskId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
