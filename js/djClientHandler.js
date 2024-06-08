import { WebRTCHandler } from './webrtcHandler.js'

export class DjClientHandler {
    constructor(djName, roomId, firebaseHandler){
        this.roomId = roomId;
        this.firebaseHandler = firebaseHandler;
        this.webrtcHandler = new WebRTCHandler();
        this.webrtcHandler.createPeerConnection();
        this.webrtcHandler.connectionCallback = (value) => this.handleConnectionCallback(value);
        this.webrtcHandler.trackCallback = (stream) => this.handleTrackCallback(stream);
        this.setupFirebaseWatchers();
        this.createCustomElement(djName);
    }

    setupFirebaseWatchers(){
        // make sure, to not watch answer
        const answerPath = '/rooms/' + this.roomId + '/answer/';
        this.firebaseHandler.unwatch(answerPath);
    }

    createCustomElement(djName){
        this.el = document.createElement('dj-client');
        this.el.name = djName;
        this.playerContainer = document.getElementById('playerContainer');
        this.playerContainer.innerHTML = '';
        this.playerContainer.appendChild(this.el);
        this.el.startCallback = () => this.start();
        this.el.stopCallback = () => this.stop();
    } 

    async start(){
        const offerPath = '/rooms/' + this.roomId + '/offer/' 
        const offer = await this.firebaseHandler.read(offerPath);
        if(offer){
            console.log(offer);
            await this.webrtcHandler.handleOffer(offer);
            const answer = await this.webrtcHandler.createAnswer();
            const answerPath = '/rooms/' + this.roomId + '/answer/';
            this.firebaseHandler.write(answerPath, answer);
        }
    }

    handleConnectionCallback(value){
        if(value){
            this.el.success = true;
        } else {
            this.el.success = false;
        }
    }

    handleTrackCallback(stream){
        const audioContainer = document.getElementById('audioContainer');
        if (audioContainer) {
            audioContainer.srcObject = stream;
            audioContainer.play().catch(error => {
                console.error("Error playing audio:", error);
            });
        }
    }


    stop(){
    }

}
