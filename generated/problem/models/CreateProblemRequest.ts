/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Sample } from './Sample';
export type CreateProblemRequest = {
    content?: string;
    inputDesc?: string;
    memoryLimit?: number;
    outputDesc?: string;
    samples?: Array<Sample>;
    source?: Array<string>;
    status?: number;
    tags?: Array<string>;
    timeLimit?: number;
    title?: string;
};

