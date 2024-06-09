export class WebRTCHandler {
    constructor() {
        this.pc = null;
        this.iceCandidates = [];
        this._connectionCallback = null;
        this._trackCallback = null;
    }
            
    createPeerConnection() {
        const configuration = { 
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
            ],
            sdpSemantics: 'unified-plan' 
        };
        this.pc = new RTCPeerConnection(configuration);
        // setup peer connection listeners
        this.pc.onicecandidate = event => this.handleICECandidate(event);
        this.pc.onconnectionstatechange = event => this.handleConnectionStateChangeEvent(event);
        this.pc.ontrack = event => this.handleTrackEvent(event);
    }
   
    handleICECandidate(event) {
        if (event.candidate) {
            this.iceCandidates.push(event.candidate);
        }
    }
  
    handleConnectionStateChangeEvent(event) {
        if (this.pc.connectionState === 'connected') {
            console.log("Peers connected");
            if (this._connectionCallback) {
                this._connectionCallback(true);
            }
        } else {
            if (this._connectionCallback) {
                this._connectionCallback(false);
            }
        }
    }

    waitToCompleteIceGathering() {
        return new Promise((resolve) => {
            this.pc.onicegatheringstatechange = (event) => {
                if (event.target.iceGatheringState === "complete") {
                    resolve();
                }
            };
        });
    }

    async createOffer() {
        try {
            const offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer);
            await this.waitToCompleteIceGathering();
            const message = {
                sdp: offer.sdp,
                type: offer.type,
                ice: this.iceCandidates
            };
            return JSON.stringify(message);
        } catch (error) {
            console.error("Error creating offer:", error);
            throw error;
        }
    }

    async createAnswer() {
        try {
            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);
            await this.waitToCompleteIceGathering();
            const message = {
                sdp: answer.sdp,
                type: answer.type,
                ice: this.iceCandidates
            };
            return JSON.stringify(message);
        } catch (error) {
            console.error("Error creating answer:", error);
            throw error;
        }
    }

    async handleOffer(data) {
        try {
            if (data) {
                const message = JSON.parse(data);
                const desc = new RTCSessionDescription({ type: message.type, sdp: message.sdp });
                await this.pc.setRemoteDescription(desc);
                this.handleICECandidates(message.ice);
            }
        } catch (error) {
            console.error("Error handling offer:", error);
        }
    }

    async handleAnswer(data) {
        try {
            if (data) {
                const message = JSON.parse(data);
                const desc = new RTCSessionDescription({ type: message.type, sdp: message.sdp });
                await this.pc.setRemoteDescription(desc);
                this.handleICECandidates(message.ice);
            }
        } catch (error) {
            console.error("Error handling answer:", error);
        }
    }

    handleICECandidates(iceCandidates) {
        iceCandidates.forEach(candidate => {
            if (candidate) {
                this.pc.addIceCandidate(candidate)
                    .then(() => {
                        console.log("ICE candidate added successfully");
                    })
                    .catch(error => {
                        console.error("Error adding ICE candidate:", error);
                    });
            }
        });
    }

    handleTrackEvent(event){
        if(this._trackCallback){
            const stream = event.streams[0];
            this._trackCallback(stream);
        }
    }

    /*------------------------------------------------------------------------*/
    /* SETTER */
    /*------------------------------------------------------------------------*/
    
    set stream(stream) {
        if (this.pc) {
            stream.getTracks().forEach(track => this.pc.addTrack(track, stream));
        } else {
            console.error("PeerConnection is not initialized.");
        }
    }

    set connectionCallback(func){
        this._connectionCallback = func;
    }

    set trackCallback(func){
        this._trackCallback = func;
    }
}
