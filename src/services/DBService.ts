import { addDoc, arrayUnion, collection, CollectionReference, doc, DocumentData, DocumentReference, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { AbstractDB, CollectionType } from "../models/AbstractDB";
import FirebaseService from "./FirebaseService";
import { ITeacher } from "../models/ITeacher";
import { IStudent } from "../models/IStudent";
import { IUser, UserType } from "../models/IUser";
import { ICourse } from "../models/ICourse";
import { IAsanas } from "../models/IAsanas";
import { UserCredential } from "firebase/auth";
import { IAnswer, ICall } from "../models/ICallManager";

/**
 * @class DBService 
 * @extends AbstractDB
 * 
 * @method getUsers Get all users
 * @method getUserName Get user name by id
 * @method getCourse Get course by id
 * @method getCourses Get all courses
 * @method getTeacherCourses Get courses by teacher id
 * @method getStudentCourses Get courses by student id
 * @method getEnrolledStudents Get enrolled students by course id
 * @method getTeachers Get all teachers
 * @method getTeacher Get teacher by id
 * @method getStudent Get student by id
 * @method getStudents Get all students
 * @method getAsanas Get all asanas
 * @method addUserDataAfterSignUp Add user data after sign up
 * @method enrollStudentInCourse Enroll student in course
 * 
 * @property {Firestore} db - Firestore instance
 * @property {CollectionReference<DocumentData>} studentColRef - Collection reference for students
 * @property {CollectionReference<DocumentData>} teacherColRef - Collection reference for teachers
 * @property {CollectionReference<DocumentData>} courseColRef - Collection reference for courses
 * @property {CollectionReference<DocumentData>} asanaColRef - Collection reference for asanas
 * @property {CollectionReference<DocumentData>} callColRef - Collection reference for calls
 * 
 * @returns {DBService} - DBService class instance
 * 
 */
export default class DBService extends AbstractDB {
    protected db: Firestore | null = null;

    // Collection references
    protected studentColRef: CollectionReference<DocumentData> | null = null;
    protected teacherColRef: CollectionReference<DocumentData> | null = null;
    protected courseColRef: CollectionReference<DocumentData> | null = null;
    protected asanaColRef: CollectionReference<DocumentData> | null = null;
    protected callColRef: CollectionReference<DocumentData> | null = null;

    // Subcollection references
    protected offerCandidatesColRef: CollectionReference | null = null;
    protected answerCandidatesColRef: CollectionReference | null = null;
    
    constructor() {
        super();
        this.db = FirebaseService.getInstance().getDb();
        this.studentColRef = collection(this.db, CollectionType.STUDENTS.valueOf());
        this.teacherColRef = collection(this.db, CollectionType.TEACHERS.valueOf());
        this.courseColRef = collection(this.db, CollectionType.COURSES.valueOf());
        this.asanaColRef= collection(this.db, CollectionType.ASANAS.valueOf());
        this.callColRef = collection(this.db, CollectionType.CALLS.valueOf());
        this.offerCandidatesColRef = collection(this.callColRef, CollectionType.OFFER_CANDIDATES.valueOf());
        this.answerCandidatesColRef = collection(this.callColRef, CollectionType.ANSWER_CANDIDATES.valueOf());
    }

    /**
     * Get collection reference by collection type
     * @param {CollectionType} collectionType - Collection type
     * @returns {CollectionReference<DocumentData>} - Collection reference
     * @throws {Error} - If collection reference not set
     */
    public getCollectionRef(collectionType: CollectionType): CollectionReference<DocumentData> {
    
        switch (collectionType) {
            case CollectionType.STUDENTS:
                return this.studentColRef!;
            case CollectionType.TEACHERS:
                return this.teacherColRef!;
            case CollectionType.COURSES:
                return this.courseColRef!;
            case CollectionType.ASANAS:
                return this.asanaColRef!;
            case CollectionType.CALLS:
                return this.callColRef!;
            case CollectionType.OFFER_CANDIDATES:
                return this.offerCandidatesColRef!;
            case CollectionType.ANSWER_CANDIDATES:
                return this.answerCandidatesColRef!;
            default:
                throw new Error('Collection reference not set');
        }
    }

    public async getUsers(): Promise<IUser[]> {
        /**
         * Get all users
         * @returns {IUser[]} - Array of type IUser
         * @throws {Error} - If collection references are not set
         * @throws {Error} - If it encounters error while getting users
         */
        try {
            if (!this.studentColRef || !this.teacherColRef) {
                throw new Error('Collection references not set');
            }
            const teacherQuerySnapshot = await getDocs(this.teacherColRef);
            const studentQuerySnapshot = await getDocs(this.studentColRef);
            const teachers = teacherQuerySnapshot.docs.map(this.docToData<ITeacher>);
            const students = studentQuerySnapshot.docs.map(this.docToData<IStudent>);
            return [...teachers, ...students];
        } catch (error) {
            throw new Error(`Error getting users: ${error}`);
        }
    }

    public async getUserName(id: string): Promise<string> {
        /**
         * Get user name by id
         * @param {string} id - User id
         * @returns {string} - User name
         * @throws {Error} - If it encounters error while getting user name
         * @throws {Error} - If collection references are not set
         */
        try {
            const allUsers = await this.getUsers();
            return allUsers.filter(user => user.id === id)[0].name;
        } catch (error) {
            throw new Error(`Error getting user name: ${error}`);
        }
    }

    public async getCourse(id: string): Promise<ICourse> {
        /**
         * Get course by id
         * @param {string} id - Course id
         * @returns {ICourse} - Course object
         * @throws {Error} - If it encounters error while getting course
         * @throws {Error} - If collection reference is not set
         */
        try {
            if (!this.courseColRef) {
                throw new Error('Collection reference not set');
            }
            const docRef = doc(this.courseColRef, id);
            const docSnapshot = await getDoc(docRef);
            return this.docToData<ICourse>(docSnapshot);
        } catch (error) {
            throw new Error(`Error getting course: ${error}`);
        }
    }

    /**
     * Get all courses
     * @returns {ICourse[]} - Array of type ICourse
     * @throws {Error} - If it encounters error while getting courses
     * @throws {Error} - If collection reference is not set
     *
     */
    public async getCourses(): Promise<ICourse[]> {
        try {
            if (!this.courseColRef) {
                throw new Error('Collection reference not set');
            }
            const querySnapshot = await getDocs(this.courseColRef);
            return querySnapshot.docs.map(this.docToData<ICourse>);
        } catch (error) {
            throw new Error(`Error getting courses: ${error}`);
        }
    }
    
    /**
     * Get courses by teacher id
     * @param {string} teacherId - Teacher id
     * @returns {ICourse[]} - Array of type ICourse
     * @throws {Error} - If it encounters error while getting teacher courses
     * @throws {Error} - If collection reference is not set
     */
    public async getTeacherCourses(teacherId: string): Promise<ICourse[]> {
        try {
            if (!this.courseColRef) {
                throw new Error('Collection reference not set');
            }
            const q = query(this.courseColRef, where('teacherId', '==', teacherId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(this.docToData<ICourse>);
        } catch (error) {
            throw new Error(`Error getting teacher courses: ${error}`);
        }
    }

    /**
     * Get courses by student id
     * @param {string} studentId - Student id
     * @returns {ICourse[]} - Array of type ICourse
     * @throws {Error} - If it encounters error while getting student courses
     * @throws {Error} - If collection reference is not set
     */
    public async getStudentCourses(studentId: string): Promise<ICourse[]> {
    
        try {
            if (!this.courseColRef) {
                throw new Error('Collection reference not set');
            }
            const q = query(this.courseColRef, where('studentIds', 'array-contains', studentId));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(this.docToData<ICourse>);
        } catch (error) {
            throw new Error(`Error getting student courses: ${error}`);
        }
    }

    /**
     * Get enrolled students by course id
     * @param {string} courseId - Course id
     * @returns {string[]} - Array of student ids
     * @throws {Error} - If it encounters error while getting enrolled students
     * @throws {Error} - If collection reference is not set
     */
    public async getEnrolledStudents(courseId: string): Promise<string[]> {
    
        try {
            if (!this.courseColRef) {
                throw new Error('Collection reference not set');
            }
            const q = query(this.courseColRef, where('id', '==', courseId));
            const querySnapshot = await getDocs(q);
            const course = querySnapshot.docs.map(this.docToData<ICourse>)[0];
            if (!course.studentIds) {
                return [];
            }
            return course.studentIds;
        } catch (error) {
            throw new Error(`Error getting enrolled students: ${error}`);
        }
    }

    /**
     * Get all teachers
     * @returns {ITeacher[]} - Array of type ITeacher
     * @throws {Error} - If it encounters error while getting teachers
     * @throws {Error} - If collection reference is not set
     */
    public async getTeachers(): Promise<ITeacher[]> {
    
        try {
            if (!this.teacherColRef) {
                throw new Error('Collection reference not set');
            }
            const querySnapshot = await getDocs(this.teacherColRef);
            return querySnapshot.docs.map(this.docToData<ITeacher>);
        } catch (error) {
            throw new Error(`Error getting teachers: ${error}`);
        }
    }

    /**
     * Get teacher by id
     * @param {string} id - Teacher id
     * @returns {ITeacher} - Teacher object
     * @throws {Error} - If it encounters error while getting teacher
     * @throws {Error} - If collection reference is not set
     */
    public async getTeacher(id: string): Promise<ITeacher> {
    
        try {
            if (!this.teacherColRef) {
                throw new Error('Collection reference not set');
            }
            const docRef = doc(this.teacherColRef, id);
            const docSnapshot = await getDoc(docRef);
            return this.docToData<ITeacher>(docSnapshot);
        } catch (error) {
            throw new Error(`Error getting teacher: ${error}`);
        }
    }

    /**
     * Get student by id
     * @param {string} id - Student id
     * @returns {IStudent} - Student object
     * @throws {Error} - If it encounters error while getting student
     * @throws {Error} - If collection reference is not set
     */
    public async getStudent(id: string): Promise<IStudent> {
    
        try {
            if (!this.studentColRef) {
                throw new Error('Collection reference not set');
            }
            const docRef = doc(this.studentColRef, id);
            const docSnapshot = await getDoc(docRef);
            return this.docToData<IStudent>(docSnapshot);
        } catch (error) {
            throw new Error(`Error getting student: ${error}`);
        }
    }

    /**
     * Get all students
     * @returns {IStudent[]} - Array of type IStudent
     * @throws {Error} - If it encounters error while getting students
     * @throws {Error} - If collection reference is not set
     */
    public async getStudents(): Promise<IStudent[]> {
    
        try {
            if (!this.studentColRef) {
                throw new Error('Collection reference not set');
            }
            const querySnapshot = await getDocs(this.studentColRef);
            return querySnapshot.docs.map(this.docToData<IStudent>);
        } catch (error) {
            throw new Error(`Error getting students: ${error}`);
        }
    }

    /**
     * Get all asanas
     * @returns {IAsanas[]}
     * @throws {Error} - If it encounters error while getting asanas
     * @throws {Error} - If collection reference is not set
     * 
     */
    public async getAsanas(): Promise<IAsanas[]> {
        try {
            if (!this.asanaColRef) {
                throw new Error('Collection reference not set');
            }
            const querySnapshot = await getDocs(this.asanaColRef);
            return querySnapshot.docs.map(this.docToData<IAsanas>);
        } catch (error) {
            throw new Error(`Error getting asanas: ${error}`);
        }
    }

    public async getCallDoc(courseId: string): Promise<ICall> {
        try {
            if (!this.callColRef) {
                throw new Error('Collection reference not set');
            }
            const docRef = doc(this.callColRef, courseId);
            const docSnapshot = await getDoc(docRef);
            return this.docToData<ICall>(docSnapshot);
        } catch (error) {
            throw new Error(`Error getting call doc: ${error}`);
        }
    }

    /**
     * Add user data after sign up
     * @param {UserCredential} UserCredential - UserCredential object
     * @param {UserType} userType - User type can either be STUDENT or TEACHER
     * @throws {Error} - If user not found in UserCredential
     * @throws {Error} - If collection reference not set
     */
    public async addUserDataAfterSignUp(UserCredential: UserCredential, userType: UserType): Promise<void> {
        try {
            if (!UserCredential.user) {
                throw new Error('User not found in UserCredential');
            }
            const { user } = UserCredential;
            const userData: IUser = {
                id: user.uid,
                name: user?.displayName!,
                email: user?.email!,
                profilePicture: user.photoURL!,
                isStudent: userType === UserType.STUDENT,
            };
            const userColRef = userType === UserType.STUDENT ? this.studentColRef : this.teacherColRef;
            if (!userColRef) {
                throw new Error('Collection reference not set');
            }
            await this.dataToDoc<IUser>(userData, userColRef);
        } catch (error) {
            throw new Error(`Error adding user data after sign up: ${error}`);
        }
    
    }

    /**
     * Enroll student in course
     * @param {string} studentId - Student id
     * @param {string} courseId - Course id
     * @throws {Error} - If collection reference not set
     * @throws {Error} - If it encounters error while enrolling student in course
     * 
     */
    public async enrollStudentInCourse(studentId: string, courseId: string): Promise<void> {
        try {
            if (!this.courseColRef) {
                throw new Error('Collection reference not set');
            }
            const courseDocRef = doc(this.courseColRef, courseId);
            await updateDoc(courseDocRef, {
                studentIds: arrayUnion(studentId),
            });
        } catch (error) {
            throw new Error(`Error enrolling student in course: ${error}`);
        }
    }

    public async initializeCallDoc(courseId: string): Promise<DocumentReference> {
        try {
            if (!this.callColRef) {
                throw new Error('Collection reference not set');
            }
            const callDocRef = doc(this.callColRef, courseId);
            await setDoc(callDocRef, 
                {
                    courseId: courseId,
                }
            );
            return callDocRef;
        } catch (error) {
            throw new Error(`Error creating call doc for course: ${error}`);
        }
    }

    public addIceCandidatesToCallDoc(
        iceCandidates: RTCIceCandidate[],
        subCollectionRef: CollectionReference): void {
        try {
            if (!subCollectionRef) {
                throw new Error('Collection reference not set');
            }
            iceCandidates.forEach(candidate => {
                addDoc(subCollectionRef, candidate.toJSON());
            });
        } catch (error) {
            throw new Error(`Error adding offer candidates: ${error}`);
        }
    }
    
    public async addOfferToCallDoc(
        docRef: DocumentReference, 
        offerDescription: RTCSessionDescriptionInit
    ): Promise<void> {
        try {
            const offer = {
                type: offerDescription.type,
                sdp: offerDescription.sdp,
            };
            await updateDoc(docRef, { offer });
        } catch (error) {
            throw new Error(`Error adding offer to call doc: ${error}`);
        }
    }

    public async addAnswerToCallDoc(
        docRef: DocumentReference, 
        answerDescription: RTCSessionDescriptionInit,
        studentId: string
    ): Promise<void> {
        try {
            const answer : IAnswer = {
                studentId: studentId,
                answer: {
                    type: answerDescription.type,
                    sdp: answerDescription.sdp,
                },
            }
            await updateDoc(docRef, { answers: arrayUnion(answer)});
        } catch (error) {
            throw new Error(`Error adding answer to call doc: ${error}`);
        }
    }

    destroy(): void {
        this.db = null;
        this.studentColRef = null;
        this.teacherColRef = null;
        this.courseColRef = null;
        this.asanaColRef = null;
        this.callColRef = null;
        this.offerCandidatesColRef = null;
        this.answerCandidatesColRef = null;
    }
}