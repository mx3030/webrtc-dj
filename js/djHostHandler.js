import { WebRTCHandler } from './webrtcHandler.js'
import { MediaHandler } from "./mediaHandler.js";

export class DjHostHandler {
    constructor(id, firebaseHandler){
        this.firebaseHandler = firebaseHandler; 
        this.mediaHandler = new MediaHandler();
        this.webrtcHandler = new WebRTCHandler();
    }

    async init(){
        await this.mediaHandler.findMics();
        const hostContainer = document.getElementById('hostContainer');
        const djHost = document.createElement('dj-host');
        hostContainer.appendChild(djHost); 
        djHost.audioDevices = this.mediaHandler.getDeviceList();
    }    
    
}
