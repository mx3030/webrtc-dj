import { WebRTCHandler } from './webrtcHandler.js'

export class DjClientHandler {
    constructor(partnerName, roomId, firebaseHandler){
        this.initUIElements();
        this.roomId = roomId;
        this.firebaseHandler = firebaseHandler;
        this.setupFirebaseWatchers();
        this.webrtcHandler = new WebRTCHandler();
        this.webrtcHandler.connectionCallback = (value) => this.handleConnectionCallback(value);
        this.webrtcHandler.trackCallback = (stream) => this.handleTrackCallback(stream); 
        this.initDjClient(partnerName);
    }
    
    initUIElements(){
        this.audioContainer = document.getElementById('audioContainer');
        this.audioContainer.classList.remove('hide');
        this.audioElement = document.getElementById('audioElement');
    }

    setupFirebaseWatchers(){
        // make sure, to not watch answer
        const answerPath = '/rooms/' + this.roomId + '/answer/';
        this.firebaseHandler.unwatch(answerPath);
    }

    initDjClient(partnerName){
        this.djClient = document.createElement('dj-client');
        this.djClient.name = partnerName;
        this.djContainer = document.getElementById('djContainer');
        this.djContainer.innerHTML = '';
        this.djContainer.appendChild(this.djClient);
        this.djClient.startCallback = () => this.start();
        this.djClient.stopCallback = () => this.stop();
    } 

    async start(){
        this.webrtcHandler.createPeerConnection();
        const offerPath = '/rooms/' + this.roomId + '/offer/' 
        const offer = await this.firebaseHandler.read(offerPath);
        if(offer){
            await this.webrtcHandler.handleOffer(offer);
            const answer = await this.webrtcHandler.createAnswer();
            const answerPath = '/rooms/' + this.roomId + '/answer/';
            this.firebaseHandler.write(answerPath, answer);
        }
    }

    handleConnectionCallback(value){
        if(value){
            this.djClient.success = true;
        } else {
            this.djClient.success = false;
        }
    }

    handleTrackCallback(stream){
        this.audioElement.srcObject = stream;
        this.audioElement.play().catch(error => {
            console.error("Error playing audio:", error);
        });
    }

    stop(){
    }

}
