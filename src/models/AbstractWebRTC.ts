
export default abstract class AbstractWebRTC {
    protected peerConnection: RTCPeerConnection | null = null;
    protected localStream: MediaStream | null = null;
    protected remoteStream: MediaStream | null = null;
    protected dataChannel: RTCDataChannel | null = null;

    constructor() {
        this.peerConnection = new RTCPeerConnection(this.getIceServerConfig());
        this.peerConnection.ontrack = this.handleTrackEvent.bind(this);
        this.peerConnection.onicecandidate = this.handleICECandidateEvent.bind(this);
        this.peerConnection.ondatachannel = this.handleDataChannelEvent.bind(this);
    }
    
    protected getIceServerConfig(): RTCConfiguration {
        return {
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun1.l.google.com:19302',
                    ]
                }
            ],
            iceCandidatePoolSize: 10,
        };
    }

    protected handleTrackEvent(event: RTCTrackEvent): void {
        event.streams[0].getTracks().forEach(track => {
            this.remoteStream?.addTrack(track);
        });
    }

    protected handleDataChannelEvent(event: RTCDataChannelEvent): void {
        this.dataChannel = event.channel;
        this.dataChannel.onmessage = this.handleDataChannelMessage.bind(this);
    }

    public setLocalStream(stream: MediaStream): void {
        this.localStream = stream;
        this.localStream.getTracks().forEach(track => {
            this.peerConnection?.addTrack(track, this.localStream!);
        });
    }

    public setRemoteStream(stream: MediaStream): void {
        this.remoteStream = stream;
    }

    public async createDataChannel(): Promise<void> {
        this.dataChannel = this.peerConnection!.createDataChannel('yoga-talks');
        this.dataChannel.onmessage = this.handleDataChannelMessage.bind(this);
    }

    protected abstract handleDataChannelMessage(event: MessageEvent): void;
    protected abstract handleICECandidateEvent(event: RTCPeerConnectionIceEvent): Promise<void>;
    protected abstract createOffer(): Promise<void>;
    protected abstract createAnswer(): Promise<void>;
    protected abstract setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
    protected abstract addIceCandidate(candidate: RTCIceCandidate): void;

    public closeAll(): void {
        // Close data channel and remove its event listeners
        if (this.dataChannel) {
            this.dataChannel.onmessage = null;
            this.dataChannel.close();
            this.dataChannel = null;
        }
    
        // Stop all tracks of the local stream
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
    
        // Stop all tracks of the remote stream
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => track.stop());
            this.remoteStream = null;
        }
    
        // Close peer connection and remove its event listeners
        if (this.peerConnection) {
            this.peerConnection.onicecandidate = null;
            this.peerConnection.ontrack = null;
            this.peerConnection.close();
            this.peerConnection = null;
        }
    }

}