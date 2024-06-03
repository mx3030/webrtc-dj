import { generateRandomId } from './utils.js'
import { AppHandler } from "./appHandler.js";

export class RoomHandler {
    constructor(firebaseHandler) {
        this.firebaseHandler = firebaseHandler;
        this.appHandler = null; 
        this.roomId = null;
        this.userId = generateRandomId('dj-'); 
        this.initUIElements();
        this.setupEventListeners();
    }
    
    initUIElements(){
        this.roomInput = document.getElementById('roomInput');
        this.roomButton = document.getElementById('roomButton');
        this.roomIdEl = document.getElementById('roomId');
        this.appContainer = document.getElementById('appContainer');
    }

    setupEventListeners(){
        this.roomButton.addEventListener('click', ()=>{
            this.createRoom();
        });
    }

    createRoom(){
        this.roomId = this.roomInput.value; 
        if (this.roomId){
            let userIds = [this.userId];
            this.firebaseHandler.write('/rooms/'+this.roomId+'/users/', userIds);
            this.enterRoom(); 
            new AppHandler(this.firebaseHandler);
        }
    }

    enterRoom(){
        this.roomInput.classList.toggle('hide');
        this.roomButton.classList.toggle('hide');
        this.roomIdEl.classList.toggle('hide');
        this.roomIdEl.textContent = this.roomId;
    } 
}
