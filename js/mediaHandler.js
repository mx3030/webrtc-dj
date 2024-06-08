export class MediaHandler {
    constructor() {
        this.mics = {};
    }

    async findMics(){
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            let devices = await navigator.mediaDevices.enumerateDevices();
            devices.forEach((device,index)=>{
                if(device["deviceId"] != null && device["kind"] == 'audioinput'){
                    let label = device["label"];
                    this.mics[label] = device["deviceId"];
                } 
            })
        } catch (error) {
            console.error('Error getting devices:', error);
            throw error;
        }
    }

    getDeviceList() {
        const devices = []; 
        devices.push('system audio');
        Object.keys(this.mics).forEach(label => {
            devices.push(label);
        })
        return devices;
    }

    async getMicAudio(label){ 
        let micId = this.mics[label];
        let micName = label;
        let options = {
            audio:{deviceId:{exact: micId}},
            video: false
        };
        try {
            const stream = await navigator.mediaDevices.getUserMedia(options);
            stream.getVideoTracks().forEach(track => stream.removeTrack(track));
            return stream;
        } catch (error) {
            console.error('Error getting mic audio stream:', error);
            throw error;
        }
    }

    async getSystemAudio(){
        let options = {
            video: true,
            audio:{ 
                autoGainControl: false,
                channelCount: 2,
                echoCancellation: false,
                latency: 0,
                noiseSuppression: false,
                sampleRate: 48000,
                sampleSize: 16,
                volume: 1.0
            }
        };
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia(options);
            stream.getVideoTracks().forEach(track => stream.removeTrack(track));
            return stream;
        } catch (error) {
            console.error('Error getting system audio stream:', error);
            throw error;
        }      
    }
}
