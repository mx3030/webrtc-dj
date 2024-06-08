import { generateRandomId } from './utils.js'
import { App } from "./app.js";

export class Room {
    constructor(firebaseHandler) {
        this.firebaseHandler = firebaseHandler;
        this.app = null; 
        this.roomId = null;
        this.userId = null; 
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
        this.roomButton.addEventListener('click', async ()=>{
            await this.createRoom();
        });
    }

    async createRoom(){
        this.roomId = this.roomInput.value; 
        if (this.roomId && await this.checkRoom()){ 
            this.enterRoom();
            this.app = new App(this.roomId, this.userId, this.firebaseHandler);
        } else {
            this.roomInput.classList.add('invalid');
        }
    }

    async checkRoom(){
        const usersPath = '/rooms/' + this.roomId + '/users/';
        const room = await this.firebaseHandler.read(usersPath);
        if(room){
            const users = await this.firebaseHandler.read(usersPath)
            console.log(users);
            // only two people are allowed in one room
            if(Object.keys(users).length<2){
                this.userId = await this.firebaseHandler.push(usersPath, "");
            } else {
                return false;
            }
        } else {
            this.userId = await this.firebaseHandler.push(usersPath, "");
        }
        // clear user from users list when reloading or closing page
        window.addEventListener('beforeunload', ()=>{
            this.firebaseHandler.remove(usersPath + this.userId);
        })
        return true;
    }

    enterRoom(){
        this.roomInput.classList.toggle('hide');
        this.roomButton.classList.toggle('hide');
        this.roomIdEl.classList.toggle('hide');
        this.roomIdEl.textContent = this.roomId;
        this.appContainer.classList.toggle('hide');
    }

    
}
