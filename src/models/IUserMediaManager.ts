/**
 * @interface IUserMediaManager - Interface for managing user media
 * 
 * @property {boolean} isAudioEnabled - Audio enabled/disabled
 * @property {boolean} isVideoEnabled - Video enabled/disabled
 * @property {boolean} isScreenSharingEnabled - Screen sharing enabled/disabled
 * 
 * @method toggleAudio - Toggle audio on/off
 * @method toggleVideo - Toggle video on/off
 * @method toggleScreenShare - Toggle screen sharing on/off
 * @method getMediaStream - Get media stream with audio and video enabled/disabled
 */
export interface IUserMediaManager {
    isAudioEnabled: boolean;
    isVideoEnabled: boolean;
    isScreenSharingEnabled: boolean;

    toggleAudio(): Promise<void>;
    toggleVideo(): Promise<void>;
    toggleScreenShare(): Promise<void>;

    getMediaStream(audio: boolean, video: boolean): Promise<MediaStream>;
}