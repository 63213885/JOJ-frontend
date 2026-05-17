/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Result_string_ } from '../models/Result_string_';
import type { Result_UserDetailVO_ } from '../models/Result_UserDetailVO_';
import type { Result_UserVO_ } from '../models/Result_UserVO_';
import type { Result_Void_ } from '../models/Result_Void_';
import type { UpdateProfileDTO } from '../models/UpdateProfileDTO';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileControllerService {
    /**
     * uploadAvatar
     * @param file file
     * @returns Result_string_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static uploadAvatarUsingPut(
        file: Blob,
    ): CancelablePromise<Result_string_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/profile/avatar',
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
    /**
     * getPrivateProfile
     * @returns Result_UserDetailVO_ OK
     * @throws ApiError
     */
    public static getPrivateProfileUsingGet(): CancelablePromise<Result_UserDetailVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/profile/info',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * updateProfile
     * @param updateProfileDto updateProfileDTO
     * @returns Result_Void_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static updateProfileUsingPut(
        updateProfileDto: UpdateProfileDTO,
    ): CancelablePromise<Result_Void_ | any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/profile/info',
            body: updateProfileDto,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
    /**
     * getPublicProfile
     * @param account account
     * @returns Result_UserVO_ OK
     * @throws ApiError
     */
    public static getPublicProfileUsingGet(
        account: string,
    ): CancelablePromise<Result_UserVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/profile/{account}',
            path: {
                'account': account,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }
}
