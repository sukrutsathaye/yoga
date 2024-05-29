import { IUser } from "./IUser";

/**
 * @interface ITeacher - Interface for Teacher
 * @extends IUser
 * @property {string[]} courseIds - courseIds of the teacher
 * @property {string[]} asanaIds - asanaIds of the teacher
 * @property {string[]} studentIds - studentIds of the teacher
 */
export interface ITeacher extends IUser {
    courseIds: string[];
    asanaIds: string[];
    studentIds?: string[];
}