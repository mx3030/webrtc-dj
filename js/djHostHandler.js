import { WebRTCHandler } from './webrtcHandler.js'
import { MediaHandler } from "./mediaHandler.js";

export class DjHostHandler {
    constructor(roomId, userId, firebaseHandler){
        this.roomId = roomId;
        this.userId = userId;
        this.mediaHandler = new MediaHandler();
        this.webrtcHandler = new WebRTCHandler();
        this.firebaseHandler = firebaseHandler; 
        this.setupFirebaseWatchers();
        this.initDjHost();
    }

    setupFirebaseWatchers(){
        const answerPath = '/rooms/' + this.roomId + '/answer/'
        this.firebaseHandler.watch(answerPath, (data) => this.webrtcHandler.handleAnswer(data));
    }

    async initDjHost(){
        await this.mediaHandler.findMics();
        this.djHost = document.createElement('dj-host');
        this.djContainer = document.getElementById('djContainer');
        this.djContainer.innerHTML = '';
        this.djContainer.appendChild(this.djHost);
        this.djHost.audioDevices = this.mediaHandler.getDeviceList();
        this.djHost.startCallback = (name, deviceIndex) => this.start(name, deviceIndex);
        this.djHost.stopCallback = (name, deviceIndex) => this.stop(name, deviceIndex);
    }   
    
    async start(name, deviceIndex){
        // handle webrtc
        this.webrtcHandler.createPeerConnection();
        const deviceLabel = this.djHost.deviceLabel;
        if (deviceLabel=='system audio'){
            this.webrtcHandler.stream = await this.mediaHandler.getSystemAudio(); 
        } else {
            this.webrtcHandler.stream = await this.mediaHandler.getMicAudio(deviceLabel);
        }
        const offer = await this.webrtcHandler.createOffer();
        const offerPath = '/rooms/' + this.roomId + '/offer/'
        this.firebaseHandler.write(offerPath, offer);   
        // handle dj client information
        const djPath = '/rooms/' + this.roomId + '/dj';
        this.firebaseHandler.write(djPath, this.userId);
        const userPath = 'rooms/' + this.roomId + '/users/' + this.userId
        this.firebaseHandler.write(userPath, this.djHost.name);
    }

    stop(name, deviceIndex){
        const djPath = '/rooms/' + this.roomId + '/dj';
        this.firebaseHandler.remove(djPath);
    }
    
}
