import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getAuth, Auth } from 'firebase/auth';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';


/**
 * @class FirebaseService 
 * @singleton 
 * @description Centralized service for Firebase SDK instances
 * 
 * @property {FirebaseApp} app - Firebase App instance
 * @property {Analytics} analytics - Firebase Analytics instance
 * @property {Auth} auth - Firebase Auth instance
 * @property {FirebaseStorage} storage - Firebase Storage instance
 * @property {Firestore} db - Firestore instance
 * @property {Functions} functions - Firebase Functions instance
 * 
 * @function getInstance - Get the singleton instance of FirebaseService
 * @function getAuth - Get the Auth instance
 * @function getStorage - Get the Storage instance
 * @function getDb - Get the Firestore instance
 * @function getFunctions - Get the Functions instance
 * @function getAnalytics - Get the Analytics instance
 * 
 */
export default class FirebaseService {
    
    private static instance: FirebaseService;
    private static firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    };

    private app: FirebaseApp;
    private analytics: Analytics;
    private auth: Auth;
    private storage: FirebaseStorage;
    private db: Firestore;
    private functions: Functions;

    private constructor() {
        this.app = initializeApp(FirebaseService.firebaseConfig);
        this.analytics = getAnalytics(this.app);
        this.auth = getAuth(this.app);
        this.storage = getStorage(this.app);
        this.db = getFirestore(this.app);
        this.functions = getFunctions(this.app);
        
    }

    /**
     * @returns {FirebaseService} - Singleton instance of FirebaseService
     */
    public static getInstance(): FirebaseService {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }

    /**
     * @returns {Auth} - Firebase Auth instance
     */
    public getAuth(): Auth {
        return this.auth;
    }

    /**
     * @returns {FirebaseStorage} - Firebase Storage instance
     */
    public getStorage(): FirebaseStorage {
        return this.storage;
    }

    /**
     * @returns {Firestore} - Firestore instance
     */
    public getDb(): Firestore {
        return this.db;
    }

    /**
     * @returns {Functions} - Firebase Functions instance
     */
    public getFunctions(): Functions {
        return this.functions;
    }

    /**
     * @returns {Analytics} - Firebase Analytics instance
     */
    public getAnalytics(): Analytics {
        return this.analytics;
    }

}