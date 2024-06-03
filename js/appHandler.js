import { DjHostHandler } from './djHostHandler.js';
import { DjClientHandler } from './djClientHandler.js';
import { generateRandomId } from './utils.js';

export class AppHandler {
    constructor(firebaseHandler) {
        this.firebaseHandler = firebaseHandler;
        this.sets = {};
        this.startHost();
    }

    async startHost(){
        const hostId = generateRandomId('host-');
        this.host = new DjHostHandler(hostId, this.firebaseHandler);
        await this.host.init();
        this.appContainer = document.getElementById('appContainer');
        this.appContainer.classList.toggle('hide');
        // TODO: load available client options
        let name = "test_client";
        this.client = new DjClientHandler(name);
        this.client.init();
    }
     
}
