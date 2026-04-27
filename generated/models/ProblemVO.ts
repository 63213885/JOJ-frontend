/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Sample } from './Sample';
export type ProblemVO = {
    acceptedCount?: number;
    content?: string;
    creatorId?: number;
    id?: number;
    inputDesc?: string;
    memoryLimit?: number;
    outputDesc?: string;
    samples?: Array<Sample>;
    source?: Array<string>;
    status?: number;
    submitCount?: number;
    tags?: Array<string>;
    timeLimit?: number;
    title?: string;
};

