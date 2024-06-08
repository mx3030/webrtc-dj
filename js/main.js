import { firebaseConfig } from "../config/firebase_config.js";
import { FirebaseHandler } from "./firebaseHandler.js";
import { Room } from "./room.js";

class Main {
    constructor(){
        this.firebaseHandler = new FirebaseHandler(firebaseConfig);
        this.room = new Room(this.firebaseHandler);
    }
}

window.onload = function() {
    new Main();
};

