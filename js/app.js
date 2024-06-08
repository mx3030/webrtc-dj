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
            this.close();
        })
    }
    
    async handleDjChange(data){
        if(!data){
            // no dj was ever active in this room, so there is no entry
            this.djHandler = new DjHostHandler(this.roomId, this.userId, this.firebaseHandler);
        } else {
            if(data!=this.userId){
                // user is not the dj himself
                const djPath = '/rooms/' + this.roomId + '/users/' + data
                const djName = await this.firebaseHandler.read(djPath);
                if(djName){
                    // dj is also in user list
                    this.djHandler = new DjClientHandler(djName, this.roomId, this.firebaseHandler);
                } else {
                    // previous dj is not in the user list anymore
                    this.djHandler = new DjHostHandler(this.roomId, this.userId, this.firebaseHandler);
                }
            }
        }
    }

    close(){
        // handle firebase when closing app as room user
        const userPath = '/rooms/' + this.roomId + '/users/' + this.userId
        this.firebaseHandler.remove(userPath);
    }
         
}
