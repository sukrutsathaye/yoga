/**
 * @module models/ICourse
 * @requires models/IUser
 * @description This module provides the interfaces for Course
 * 
 * @fileoverview Interface for Course and related types and enums for Course
 * This file also contains the reducer for Course
 */
import { Identifiable } from "./IUser";




/**
 * @enum CourseStatus - Enum for CourseStatus
 * @readonly
 * @property {string} ACTIVE - Active
 * @property {string} INACTIVE - Inactive
 * @property {string} COMPLETED - Completed
 */
export enum CourseStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    COMPLETED = 'completed',
}

/**
 * @interface ICourse - Interface for Course
 * @extends Identifiable
 * @property {string} name - name of the course
 * @property {string} description - description of the course
 * @property {string} teacherId - teacherId of the course
 * @property {string[]} studentIds - studentIds of the course
 * @property {Date} startDate - startDate of the course
 * @property {number} duration - duration of the course
 * @property {number} cost - cost of the course
 * @property {string[]} tags - tags of the course
 * @property {string} image - image of the course
 * @property {CourseStatus} status - status of the course
 * @property {string[]} asanaIds - asanaIds of the course
 */
export interface ICourse extends Identifiable {
    name: string;
    description: string;
    teacherId: string;
    studentIds: string[];
    startDate: Date;
    duration: number;
    cost: number;
    tags: string[];
    image: string;
    status: CourseStatus;
    asanaIds?: string[];
}

/**
 * @type CourseAction - Type for CourseAction
 * @property {string} type - type of the action
 * @property {string} payload - payload of the action
 */
export type CourseAction =
    | {
        type: 'set_name' | 'set_description' | 'set_teacherId' | 'set_image';
        payload: string; }
    | { type: 'set_studentIds' | 'set_tags' | 'set_asanas'; payload: string[] }
    | { type: 'set_startDate'; payload: Date }
    | { type: 'set_duration' | 'set_cost'; payload: number }
    | { type: 'set_status'; payload: CourseStatus }

/**
 * @function courseReducer - Reducer for Course
 * @param {ICourse} state - state of the course
 * @param {CourseAction} action - action for the course
 * @returns {ICourse} - returns the course
 */
export const courseReducer = (state: ICourse, action: CourseAction): ICourse => {
    switch (action.type) {
        case 'set_name':
            return { ...state, name: action.payload };
        case 'set_description':
            return { ...state, description: action.payload };
        case 'set_teacherId':
            return { ...state, teacherId: action.payload };
        case 'set_studentIds':
            return { ...state, studentIds: action.payload };
        case 'set_startDate':
            return { ...state, startDate: action.payload };
        case 'set_duration':
            return { ...state, duration: action.payload };
        case 'set_cost':
            return { ...state, cost: action.payload };
        case 'set_tags':
            return { ...state, tags: action.payload };
        case 'set_image':
            return { ...state, image: action.payload };
        case 'set_status':
            return { ...state, status: action.payload };
        case 'set_asanas':
            return { ...state, asanaIds: action.payload };
        default:
            return state;
    }
}
