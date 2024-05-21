// src/models/IUser.ts

export interface Identifiable {
    id: string;
}
  
export interface IUser extends Identifiable {
    name: string;
    email: string;
    profilePicture: string;
    isStudent: boolean;
    age?: number;

}
  
export type UserAction =
    | {
        type: 'set_name' | 'set_email' | 'set_profilePicture';
        payload: string;}
    | { type: 'set_isStudent'; payload: boolean }
    | { type: 'set_age'; payload: number };
  
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
        case 'set_age':
        return { ...state, age: action.payload };
        default:
        return state;
    }
};
  