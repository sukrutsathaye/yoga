
import { CollectionReference, DocumentData, DocumentReference, onSnapshot } from "firebase/firestore";
import ICallManager, { IAnswer } from "../models/ICallManager";
import { CollectionType } from "../models/AbstractDB";
import DBService from "./DBService";
import UserMediaManager from "./UserMediaManager";
import WebRTCService from "./WebRTCService";

export default class CallManager implements ICallManager {

    private dbService: DBService | null = null;
    private mediaManager: UserMediaManager | null = null;
    private webRTCService: WebRTCService | null = null;
    private offerCandidatesRef: CollectionReference | null = null;
    private answerCandidatesRef: CollectionReference | null = null;
    private callDocRef: DocumentReference<DocumentData> | null = null;
    public offer: RTCSessionDescriptionInit | null = null;
    public answers: IAnswer[] = [];
    public offerCandidates: RTCIceCandidate[] = [];
    public answerCandidates: RTCIceCandidate[] = [];
    public courseId: string = '';
    public teacherId: string | null = null;
    private callParticipants: Map<string, WebRTCService> = new Map();

    constructor(
        courseId: string,
        teacherId: string
    ) {
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.dbService = new DBService();
        this.mediaManager = new UserMediaManager();
        this.webRTCService = new WebRTCService();
        this.offerCandidatesRef = this.dbService.getCollectionRef(CollectionType.OFFER_CANDIDATES);
        this.answerCandidatesRef = this.dbService.getCollectionRef(CollectionType.ANSWER_CANDIDATES);
        
    }

    private async setUpCall(): Promise<void> {
        try {
            this.callDocRef = await this.dbService!.initializeCallDoc(this.courseId!);
            this.webRTCService!.setLocalStream(
                await this.mediaManager!.getMediaStream(true, true),
            );
        } catch (error) {
            console.error(`Error setting up call: ${error}`);
            throw new Error(`Error setting up call: ${error}`);
        }
    }

    private handleIceCandidateSnapshot(docRef: CollectionReference<DocumentData>): void {
        onSnapshot(docRef, async (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added') {
                    const candidate = change.doc.data() as RTCIceCandidate;
                    this.webRTCService!.addIceCandidate(candidate);
                }
            });
        });
    }
    
    public async startCall(): Promise<void> {
        try {
            await this.setUpCall();
            await this.webRTCService!.createOffer();
            const offerDescription = this.webRTCService!.getOffer();
            if (!offerDescription) {
                throw new Error('Error getting offer');
            }
            const offerCandidates = this.webRTCService!.getOfferCandidates();

            this.dbService!.addIceCandidatesToCallDoc(offerCandidates, this.offerCandidatesRef!);

            await this.dbService!.addOfferToCallDoc(
                this.callDocRef!,
                offerDescription,
            );

            this.handleIceCandidateSnapshot(this.answerCandidatesRef!);

        } catch (error) {
            console.error(`Error starting call: ${error}`);
            throw new Error(`Error starting call: ${error}`);
        }
    }

    public async joinCall(studentId: string): Promise<void> {
        try {
            await this.setUpCall();
            const callData = await this.dbService!.getCallDoc(this.courseId!);
            if (!callData || !callData.offer) {
                throw new Error('No offer for call');
            }
            await this.webRTCService!.setRemoteDescription(callData.offer);
            await this.webRTCService!.createAnswer();
            const answerDescription = this.webRTCService!.getAnswer();
            if (!answerDescription) {
                throw new Error('Error creating answer');
            }
            await this.webRTCService!.setLocalDescription(answerDescription);
            await this.dbService!.addAnswerToCallDoc(this.callDocRef!, answerDescription, studentId);
            const answerCandidates = this.webRTCService!.getAnswerCandidates();
            this.dbService!.addIceCandidatesToCallDoc(answerCandidates, this.answerCandidatesRef!);

            this.handleIceCandidateSnapshot(this.offerCandidatesRef!);

        } catch (error) {
            console.error(`Error joining call: ${error}`);
            throw new Error(`Error joining call: ${error}`);
        }
    }

    public async endCall(): Promise<void> {
        try {
           this.webRTCService!.closeAll();
           this.webRTCService!.setPeerConnection(null);
           this.mediaManager!.stopMediaStream();
        } catch (error) {
            console.error(`Error ending call: ${error}`);
            throw new Error(`Error ending call: ${error}`);
        }
    }

    destroy(): void {
        this.dbService!.destroy();
        this.mediaManager = null;
        this.webRTCService!.destroy();
        this.offerCandidatesRef = null;
        this.answerCandidatesRef = null;
        this.callDocRef = null;
    }

}