/**
 * @module models/IUser
 * @requires models/Identifiable
 * @requires models/UserType
 * @description This module provides the interfaces for User
 * 
 * @fileoverview Interface for User
 * and related types and enums for User
 * 
 * @example
 * import { IUser } from "./models/IUser";
 * const user: IUser = {
 *    id: '123',
 *    name: 'John Doe',
 *    email: 'john.doe@email.com',
 *    profilePicture: 'https://www.example.com/johndoe.jpg',
 *    isStudent: true,
 * };
 */

/**
 * @interface Identifiable - Interface for Identifiable
 * @property {string} id - id of the user
 */
export interface Identifiable {
    id: string;
}

/**
 * @enum UserType - Enum for UserType
 * @property {string} ADMIN - Admin
 * @property {string} TEACHER - Teacher
 * @property {string} STUDENT - Student
 * 
 * @readonly
 */
export enum UserType {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
}


/**
 * @interface IUser - Interface for User
 * @extends Identifiable
 * @property {string} name - name of the user
 * @property {string} email - email of the user
 * @property {string} profilePicture - profilePicture of the user
 * @property {boolean} isStudent - whether the user is student or not
 */
export interface IUser extends Identifiable {
    name: string;
    email: string;
    profilePicture: string;
    isStudent: boolean;
}

/**
 * @type UserAction - Type for UserAction
 * @property {string} type - type of the action
 * @property {string} payload - payload of the action
 */
export type UserAction =
    | {
        type: 'set_name' | 'set_email' | 'set_profilePicture';
        payload: string;}
    | { type: 'set_isStudent'; payload: boolean };

/**
 * @function userReducer - Reducer for User
 * @param {IUser} state - state of the user
 * @param {UserAction} action - action for the user
 * @returns {IUser} - returns the user
 */
export const userReducer = (state: IUser, action: UserAction): IUser => {
    switch (action.type) {
        case 'set_name':
        return { ...state, name: action.payload };
        case 'set_email':
        return { ...state, email: action.payload };
        case 'set_profilePicture':
        return { ...state, profilePicture: action.payload };
        case 'set_isStudent':
        return { ...state, isStudent: action.payload };
        default:
        return state;
    }
};
  