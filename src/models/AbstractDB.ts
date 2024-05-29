import { addDoc, CollectionReference, doc, DocumentData, DocumentReference, DocumentSnapshot, setDoc } from "firebase/firestore";
import { IUser, Identifiable, UserType } from "./IUser";
import { IStudent } from "./IStudent";
import { ITeacher } from "./ITeacher";
import { ICourse } from "./ICourse";
import { UserCredential } from "firebase/auth";

/**
 * Collection types for Firestore
 * @enum {string}
 * @readonly
 * 
 */
export enum CollectionType {
    STUDENTS = 'students',
    TEACHERS = 'teachers',
    COURSES = 'courses',
    ASANAS = 'asanas',
    CALLS = 'calls',
    OFFER_CANDIDATES = 'offerCandidates',
    ANSWER_CANDIDATES = 'answerCandidates',
}

/**
 * Abstract class for Firestore service
 * @abstract @class AbstractDB
 * @description Interface for Firestore service
 * 
 * @function docToData - Extract the data from a document according to the data type
 * @function dataToDoc - Write data of type T to the Firestore collection provided
 * 
 */
export abstract class AbstractDB {

    protected docToData<T extends Identifiable>(
        doc: DocumentSnapshot<DocumentData>
    ): T {
        /**
         * Extract the data from a document according to the data type
         * @param {DocumentSnapshot<DocumentData>} doc - Document snapshot
         * @returns {T} - Data from the document with the id of type T
         * @type {T} - Data type for the document
         * @throws {Error} - No data for document
         * 
         */
        const data: T = doc.data() as T;
        if (!data) {
            throw new Error(`No data for document ${doc.id}`);  
        }
        return { ...data, id: doc.id };
    }

    protected async dataToDoc<T extends Identifiable>(
       data: T,
       collection: CollectionReference<DocumentData>
    ): Promise<DocumentReference<DocumentData>> {
        /**
         * Write data of type T to the Firestore collection provided
         * Removes the id from the data object before writing
         * Uses the id from data object to write new document if does not exist
         * @param {T} data - Data to write to Firestore
         * @param {CollectionReference<DocumentData>} collection - Firestore collection reference
         * @returns {DocumentReference<DocumentData>} - Reference to the document written
         * @throws {Error} - Error writing document
         * 
         */
        let docRef: DocumentReference<DocumentData>;
        let dataWithoutId: Partial<Identifiable> = { ...data };
        delete (dataWithoutId as Partial<T>).id;
        try {
            if (data.id) {
                docRef = doc(collection, data.id);
                await setDoc(docRef, dataWithoutId as T);
            } else {
                docRef = await addDoc(collection, dataWithoutId as T);
            }
            return docRef;
        } catch (error) {
            throw new Error(`Error writing document: ${error}`);
        }

    }

    // User related getters
    public abstract getUserName(id: string): Promise<string>;
    public abstract getTeacher(id: string): Promise<ITeacher>;
    public abstract getTeachers(): Promise<ITeacher[]>;
    public abstract getStudent(id: string): Promise<IStudent>;
    public abstract getStudents(): Promise<IStudent[]>;
    public abstract getUsers(): Promise<IUser[]>;

    // Course related getters
    public abstract getCourse(id: string): Promise<ICourse>;   
    public abstract getTeacherCourses(teacherId: string): Promise<ICourse[]>;
    public abstract getStudentCourses(studentId: string): Promise<ICourse[]>;
    public abstract getEnrolledStudents(courseId: string): Promise<string[]>;
    
    // Setters
    public abstract addUserDataAfterSignUp(
        UserCredential: UserCredential,
        userType: UserType,
    ): Promise<void>;
    public abstract enrollStudentInCourse(
        studentId: string,
        courseId: string,
    ): Promise<void>;
}

