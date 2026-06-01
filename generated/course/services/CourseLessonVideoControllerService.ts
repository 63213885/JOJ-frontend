/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Result_VideoPlayInfoVO_ } from '../models/Result_VideoPlayInfoVO_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseLessonVideoControllerService {
    /**
     * getVideoPlayInfo
     * @param lessonId lessonId
     * @returns Result_VideoPlayInfoVO_ OK
     * @throws ApiError
     */
    public static getVideoPlayInfoUsingGet(
        lessonId: number,
    ): CancelablePromise<Result_VideoPlayInfoVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/lesson/{lessonId}/video/play-info',
            path: {
                'lessonId': lessonId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
