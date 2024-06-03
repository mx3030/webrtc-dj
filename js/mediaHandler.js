export class MediaHandler {
    constructor() {
        this.mics = [];
    }

    async findMics(){
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            let devices = await navigator.mediaDevices.enumerateDevices();
            devices.forEach((device,index)=>{
                if(device.deviceId != null && device.kind == 'audioinput'){
                    this.mics.push(device);
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
        this.mics.forEach(device => {
            devices.push(device["label"]);
        })
        return devices;
    }

    async getMicAudio(mic){ 
        let micId = mic["deviceId"];
        let micName = mic["label"];
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
            audio: true
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


