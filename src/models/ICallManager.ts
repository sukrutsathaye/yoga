import { Identifiable } from "./IUser";

export interface IAnswer {
    studentId: string;
    answer: RTCSessionDescriptionInit;
}

export interface ICall extends Identifiable {
    courseId: string;
    teacherId: string;
    offer: RTCSessionDescriptionInit;
    answers: IAnswer[];
    offerCandidates: RTCIceCandidate[];
    answerCandidates: RTCIceCandidate[];
}

export default interface ICallManager {
    
    offer: RTCSessionDescriptionInit | null;
    answers: IAnswer[];
    offerCandidates: RTCIceCandidate[];
    answerCandidates: RTCIceCandidate[];
    courseId: string;
    teacherId: string | null;

    startCall(): Promise<void>;
    endCall(): Promise<void>;
    joinCall(studentId: string): Promise<void>;

}