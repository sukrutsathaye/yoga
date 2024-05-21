// src/models/User.ts

import { IUser } from './IUser';

export abstract class User implements IUser {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public profilePicture: string,
    public isStudent: boolean,
    public age?: number
  ) {}

  abstract update(action: { type: string; payload: string | boolean | number }): void;
  abstract signIn(): Promise<void>;
  abstract signOut(): Promise<void>;
  abstract updateProfile(): Promise<void>;
}
