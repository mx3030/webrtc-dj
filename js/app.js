import { DjHostHandler } from './djHostHandler.js';
import { DjClientHandler } from './djClientHandler.js';

export class App {
    constructor(roomId, userId, firebaseHandler) {
        this.roomId = roomId; 
        this.userId = userId;
        this.firebaseHandler = firebaseHandler;
        this.djHandler = null;
        this.setupFirebaseWatchers();
        this.setupEventListeners();
    }

    setupFirebaseWatchers(){
        const djPath = '/rooms/' + this.roomId + '/dj'
        this.firebaseHandler.watch(djPath, (data)=>this.handleDjChange(data));
    }

    setupEventListeners(){
        window.addEventListener('beforeunload', ()=>{
            this.firebaseExit();
        })
    }
    
    async handleDjChange(data){
        if(!data){
            // since room creation, no dj active
            this.djHandler = new DjHostHandler(this.roomId, this.userId, this.firebaseHandler);
        } else {
            if(data!=this.userId){
                // partner is maybe the dj
                const partnerPath = '/rooms/' + this.roomId + '/users/' + data
                const partnerName = await this.firebaseHandler.read(partnerPath);
                if(partnerName){
                    // partner is still in the room
                    this.djHandler = new DjClientHandler(partnerName, this.roomId, this.firebaseHandler);
                } else {
                    // partner is not in the room
                    this.djHandler = new DjHostHandler(this.roomId, this.userId, this.firebaseHandler);
                }
            }
        }
    }

    firebaseExit(){
        const userPath = '/rooms/' + this.roomId + '/users/' + this.userId
        this.firebaseHandler.remove(userPath);
    }
         
}
