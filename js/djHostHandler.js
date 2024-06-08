import { WebRTCHandler } from './webrtcHandler.js'
import { MediaHandler } from "./mediaHandler.js";

export class DjHostHandler {
    constructor(roomId, userId, firebaseHandler){
        this.roomId = roomId;
        this.userId = userId;
        this.firebaseHandler = firebaseHandler; 
        this.mediaHandler = new MediaHandler();
        this.webrtcHandler = new WebRTCHandler();
        this.createCustomElement();
        this.setupFirebaseWatchers();
    }

    setupFirebaseWatchers(){
        const answerPath = '/rooms/' + this.roomId + '/answer/'
        this.firebaseHandler.watch(answerPath, (data) => this.webrtcHandler.handleAnswer(data));
    }

    async createCustomElement(){
        await this.mediaHandler.findMics();
        this.el = document.createElement('dj-host');
        this.playerContainer = document.getElementById('playerContainer');
        this.playerContainer.innerHTML = '';
        this.playerContainer.appendChild(this.el);
        this.el.audioDevices = this.mediaHandler.getDeviceList();
        this.el.startCallback = (name, deviceIndex) => this.start(name, deviceIndex);
        this.el.stopCallback = (name, deviceIndex) => this.stop(name, deviceIndex);
    }   
    
    async start(name, deviceIndex){
        // handle webrtc
        this.webrtcHandler.createPeerConnection();
        const deviceLabel = this.el.deviceLabel;
        if (deviceLabel=='system audio'){
            let stream = await this.mediaHandler.getSystemAudio();
            this.webrtcHandler.addStream(stream); 
        } else {
            let stream = await this.mediaHandler.getMicAudio(deviceLabel)
            this.webrtcHandler.addStream(stream);
        }
        const offer = await this.webrtcHandler.createOffer();
        const offerPath = '/rooms/' + this.roomId + '/offer/'
        this.firebaseHandler.write(offerPath, offer);   
        // handle dj client information
        const djPath = '/rooms/' + this.roomId + '/dj';
        this.firebaseHandler.write(djPath, this.userId);
        const userPath = 'rooms/' + this.roomId + '/users/' + this.userId
        this.firebaseHandler.write(userPath, this.el.name);
    }

    stop(name, deviceIndex){
        const djPath = '/rooms/' + this.roomId + '/dj';
        this.firebaseHandler.remove(djPath);
    }
    
}
