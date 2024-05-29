// src/services/AuthService.ts

import { 
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as signOutAuth,
  UserCredential,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import FirebaseService from './FirebaseService';
import IAuthService from '../models/IAuthService';

/**
 * @class AuthService
 * @implements IAuthService
 * @description Service for authentication with Firebase
 * 
 * @property {Auth} auth - Firebase Auth instance
 * 
 * @function signUpWithEmail - Function to sign up with email
 * @function signInWithEmail - Function to sign in with email
 * @function signInWithGoogle - Function to sign in with Google
 * @function signOut - Function to sign out
 * 
 */
export default class AuthService implements IAuthService {
  protected auth: Auth;

  constructor() {
    this.auth = FirebaseService.getInstance().getAuth();
  }
  
  
  public async signUpWithEmail(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public async signInWithEmail(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public async signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  public async signOut(): Promise<void> {
    return signOutAuth(this.auth);
  }
}
