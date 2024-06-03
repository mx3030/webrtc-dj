import { firebaseConfig } from "../config/firebase_config.js";
import { FirebaseHandler } from "./firebaseHandler.js";
import { RoomHandler } from "./roomHandler.js";
import { AppHandler } from "./appHandler.js";

class Main {
    constructor(){
        this.firebaseHandler = new FirebaseHandler(firebaseConfig);
        this.roomHandler = new RoomHandler(this.firebaseHandler);
    }
}

window.onload = function() {
    new Main();
};

