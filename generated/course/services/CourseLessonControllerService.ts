/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseLessonCreateRequest } from '../models/CourseLessonCreateRequest';
import type { CourseLessonUpdateRequest } from '../models/CourseLessonUpdateRequest';
import type { Result_boolean_ } from '../models/Result_boolean_';
import type { Result_CourseLessonVO_ } from '../models/Result_CourseLessonVO_';
import type { Result_List_CourseLessonVO_ } from '../models/Result_List_CourseLessonVO_';
import type { Result_long_ } from '../models/Result_long_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseLessonControllerService {
    /**
     * addLesson
     * @param request request
     * @returns Result_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addLessonUsingPost(
        request: CourseLessonCreateRequest,
    ): CancelablePromise<Result_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/lesson',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateLesson
     * @param request request
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateLessonUsingPut(
        request: CourseLessonUpdateRequest,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/course/lesson',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listLessons
     * @param courseId courseId
     * @returns Result_List_CourseLessonVO_ OK
     * @throws ApiError
     */
    public static listLessonsUsingGet(
        courseId: number,
    ): CancelablePromise<Result_List_CourseLessonVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/lesson/list',
            query: {
                'courseId': courseId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getLesson
     * @param id id
     * @returns Result_CourseLessonVO_ OK
     * @throws ApiError
     */
    public static getLessonUsingGet(
        id: number,
    ): CancelablePromise<Result_CourseLessonVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/lesson/{id}',
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
     * deleteLesson
     * @param id id
     * @returns Result_boolean_ OK
     * @throws ApiError
     */
    public static deleteLessonUsingDelete(
        id: number,
    ): CancelablePromise<Result_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/course/lesson/{id}',
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
