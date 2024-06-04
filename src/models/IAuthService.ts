import { UserCredential } from "firebase/auth";

/**
 * @abstract @class IAuthService
 * @description Interface for AuthService
 * 
 * @function signUpWithEmail - Function to sign up with email
 * @function signInWithEmail - Function to sign in with email
 * @function signInWithGoogle - Function to sign in with Google
 * @function signOut - Function to sign out
 */
export default interface IAuthService {
    signUpWithEmail(email: string, password: string): Promise<UserCredential>;
    signInWithEmail(email: string, password: string): Promise<UserCredential>;
    signInWithGoogle(): Promise<UserCredential>;
    signOut(): Promise<void>;
}