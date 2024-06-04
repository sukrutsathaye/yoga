import { IUserMediaManager } from "../models/IUserMediaManager";

/**
 * @class UserMediaManager which manages user media
 * @implements IUserMediaManager
 * 
 * @property {boolean} isAudioEnabled - Audio enabled/disabled
 * @property {boolean} isVideoEnabled - Video enabled/disabled
 * @property {boolean} isScreenSharingEnabled - Screen sharing enabled/disabled
 * @property {MediaStream | null} localStream - Local media stream
 * @property {MediaStream | null} screenStream - Screen media stream
 * 
 * @method getMediaStream - Get media stream with audio and video enabled/disabled
 * @method toggleAudio - Toggle audio on/off
 * @method toggleVideo - Toggle video on/off
 * @method toggleScreenShare - Toggle screen sharing on/off
 * 
 */
export default class UserMediaManager implements IUserMediaManager {
    isAudioEnabled: boolean = false;
    isVideoEnabled: boolean = false;
    isScreenSharingEnabled: boolean = false;

    protected localStream: MediaStream | null = null;
    protected screenStream: MediaStream | null = null;	

    public async getMediaStream(
        audio: boolean, 
        video: boolean
    ): Promise<MediaStream> {
        /**
         * Get media stream with audio and video enabled/disabled
         * @param {boolean} audio - Audio enabled/disabled
         * @param {boolean} video - Video enabled/disabled
         * @returns {MediaStream} - Media stream with audio and video enabled/disabled
         */
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({audio, video});
            this.isAudioEnabled = audio;
            this.isVideoEnabled = video;
            return this.localStream;
        } catch (error) {
            console.error(`Error getting media stream: ${error}`);
            throw new Error(`Error getting media stream: ${error}`);
        }
    }
    
    public async toggleAudio(): Promise<void> {
        /**
         * Toggle audio on/off
         */
        if (!this.localStream) {
            this.localStream = await this.getMediaStream(true, this.isVideoEnabled);
        }
        this.isAudioEnabled = !this.isAudioEnabled;
        this.localStream.getAudioTracks().forEach(track => track.enabled = this.isAudioEnabled);
    }

    public async toggleVideo(): Promise<void> {
        /**
         * Toggle video on/off
         */
        if (!this.localStream) {
            this.localStream = await this.getMediaStream(this.isAudioEnabled, true);
        }
        this.isVideoEnabled = !this.isVideoEnabled;
        this.localStream.getVideoTracks().forEach(track => track.enabled = this.isVideoEnabled);
    }

    public async toggleScreenShare(): Promise<void> {
        /**
         * Toggle screen sharing on/off
         */
        if (!this.screenStream) {
            this.screenStream = await navigator.mediaDevices.getDisplayMedia({video: true});
        }
        this.isScreenSharingEnabled = !this.isScreenSharingEnabled;
        this.screenStream.getVideoTracks().forEach(track => track.enabled = this.isScreenSharingEnabled);
    }

    public stopMediaStream(): void {
        /**
         * Stop media stream
         */
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        if (this.screenStream) {
            this.screenStream.getTracks().forEach(track => track.stop());
            this.screenStream = null;
        }
        this.isAudioEnabled = false;
        this.isVideoEnabled = false;
        this.isScreenSharingEnabled = false;
    }

    destroy(): void {
        this.stopMediaStream();
    }
}