import { IUser } from "./IUser";

/**
 * @interface IStudent - Interface for Student
 * @extends IUser
 * @property {string[]} courseIds - courseIds of the student
 * @property {string[]} asanaIds - asanaIds of the student
 * @property {number} height - height of the student
 * @property {number} weight - weight of the student
 * @property {number} age - age of the student
 * @property {boolean} isPregnant - whether the student is pregnant or not
 */
export interface IStudent extends IUser {
    courseIds: string[];
    asanaIds: string[];
    height?: number;
    weight?: number;
    age?: number
    isPregnant?: boolean;
}