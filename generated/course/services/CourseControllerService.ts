/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourseCreateRequest } from '../models/CourseCreateRequest';
import type { CourseUpdateRequest } from '../models/CourseUpdateRequest';
import type { Result_boolean_ } from '../models/Result_boolean_';
import type { Result_CourseVO_ } from '../models/Result_CourseVO_';
import type { Result_List_CourseVO_ } from '../models/Result_List_CourseVO_';
import type { Result_long_ } from '../models/Result_long_';
import type { Result_string_ } from '../models/Result_string_';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CourseControllerService {
    /**
     * addCourse
     * @param request request
     * @returns Result_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static addCourseUsingPost(
        request: CourseCreateRequest,
    ): CancelablePromise<Result_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateCourse
     * @param request request
     * @returns Result_boolean_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateCourseUsingPut(
        request: CourseUpdateRequest,
    ): CancelablePromise<Result_boolean_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/course',
            body: request,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * listOnlineCourses
     * @returns Result_List_CourseVO_ OK
     * @throws ApiError
     */
    public static listOnlineCoursesUsingGet(): CancelablePromise<Result_List_CourseVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/list',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getCourse
     * @param id id
     * @returns Result_CourseVO_ OK
     * @throws ApiError
     */
    public static getCourseUsingGet(
        id: number,
    ): CancelablePromise<Result_CourseVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/course/{id}',
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
     * deleteCourse
     * @param id id
     * @returns Result_boolean_ OK
     * @throws ApiError
     */
    public static deleteCourseUsingDelete(
        id: number,
    ): CancelablePromise<Result_boolean_> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/course/{id}',
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
     * uploadCover
     * @param file file
     * @param id id
     * @returns Result_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadCoverUsingPost(
        file: Blob,
        id: number,
    ): CancelablePromise<Result_string_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/course/{id}/upload/cover',
            path: {
                'id': id,
            },
            formData: {
                'file': file,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
