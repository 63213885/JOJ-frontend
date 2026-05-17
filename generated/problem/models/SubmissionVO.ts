/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProblemVO } from './ProblemVO';
import type { UserVO } from './UserVO';
export type SubmissionVO = {
    code?: string;
    id?: number;
    language?: string;
    memoryUsed?: number;
    problem?: ProblemVO;
    score?: number;
    status?: string;
    submitTime?: string;
    timeUsed?: number;
    user?: UserVO;
};

