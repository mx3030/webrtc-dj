export class WebRTCHandler {
    
    constructor() {
        this.createPeerConnection();
    }

    createPeerConnection(stream) {
        const configuration = { sdpSemantics: 'unified-plan' };
        this.pc = new RTCPeerConnection(configuration);
        // setup peer connection listeners
        this.pc.onconnectionstatechange = event => this.handleConnectionStateChangeEvent(event);
    }

    addStream(stream) {
        stream.getTracks().forEach(track => this.pc.addTrack(track, stream));
    }

    handleConnectionStateChangeEvent(event){
        console.log(this.pc.connectionState)
        if(this.pc.connectionState=='connected'){
            console.log("peers connected")
        }
    } 

    async createOffer() {
        try {
            const offer = await this.pc.createOffer();
            await this.pc.setLocalDescription(offer); 
            let data = {
                "sdp" : offer.sdp,
                "type" : offer.type
            };
            let message = {
                "topic" : 'offer',
                "data" : data
            };
            return message
        } catch (error) {
            console.log(error);
        }
    }

    async createAnswer() {
        try {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            let data = {
                "sdp" : answer.sdp,
                "type" : answer.type
            };
            let message = {
                "topic" : 'answer',
                "data" : data
            };
            return answer
        } catch (error) {
            console.log(error);
        }
    }

    async handleOffer(data) {
        const desc = new RTCSessionDescription(data.sdp);
        await pc.setRemoteDescription(desc);
    }

    async handleAnswer(data) {
        try {
            const desc = new RTCSessionDescription(data);
            await this.pc.setRemoteDescription(desc);
        } catch (error) {
            console.log(error);
        }
    } 
}


