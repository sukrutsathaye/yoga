import AbstractWebRTC from "../models/AbstractWebRTC";

export default class WebRTCService extends AbstractWebRTC {

    protected offerCandidates: RTCIceCandidate[] = [];
    protected answerCandidates: RTCIceCandidate[] = [];
    protected offer: RTCSessionDescriptionInit | null = null;
    protected answer: RTCSessionDescriptionInit | null = null;
    protected messages: string[] = [];


    constructor() {
        super();
    }

    public handleDataChannelMessage(event: MessageEvent): void {
        this.messages.push(JSON.parse(event.data));
    }
    
    public async handleICECandidateEvent(event: RTCPeerConnectionIceEvent): Promise<void> {
        if (event.candidate) {
            if (this.peerConnection?.localDescription?.type === 'offer') {
                this.offerCandidates.push(event.candidate);
            } else if (this.peerConnection?.localDescription?.type === 'answer') {
                this.answerCandidates.push(event.candidate);
            }
        }
    }

    public async createOffer(): Promise<void> {
        try {
            this.offer = await this.peerConnection!.createOffer();
            if (!this.offer) {
                throw new Error('Error creating offer');
            }
            await this.peerConnection?.setLocalDescription(this.offer);
        } catch (error) {
            console.error(`Error creating offer: ${error}`);
            throw new Error(`Error creating offer: ${error}`);
        }
    }

    public async createAnswer(): Promise<void> {
        this.peerConnection!.createAnswer().then(async (answer) => {
            if (!answer) {
                throw new Error('Error creating answer');
            }
            await this.peerConnection!.setLocalDescription(answer);
        }).catch((error) => {
            console.error(`Error creating answer: ${error}`);
            throw new Error(`Error creating answer: ${error}`);
        });
    }

    public async setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
        await this.peerConnection!.setRemoteDescription(new RTCSessionDescription(description));
    }

    public async setLocalDescription(description: RTCSessionDescriptionInit): Promise<void> {
        await this.peerConnection!.setLocalDescription(description);
    }

    public addIceCandidate(candidate: RTCIceCandidate): void {
        this.peerConnection!.addIceCandidate(candidate);
    }

    public getOfferCandidates(): RTCIceCandidate[] {
        return this.offerCandidates;
    }

    public getAnswerCandidates(): RTCIceCandidate[] {
        return this.answerCandidates;
    }

    public getOffer(): RTCSessionDescriptionInit | null {
        return this.offer;
    }

    public getAnswer(): RTCSessionDescriptionInit | null {
        return this.answer;
    }

    public setPeerConnection(peerConnection: RTCPeerConnection | null): void {
        this.peerConnection = peerConnection;
    }

    destroy(): void {
        this.closeAll();
        this.offerCandidates = [];
        this.answerCandidates = [];
        this.offer = null;
        this.answer = null;
        this.messages = [];
    }
        
}