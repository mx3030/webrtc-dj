

export class DjClientHandler {
    constructor(name){
        this.name = name; 
    }

    init(){
        const clientContainer = document.getElementById('clientContainer');
        const djClient = document.createElement('dj-client');
        djClient.name = this.name;
        clientContainer.appendChild(djClient); 
    }  
}
