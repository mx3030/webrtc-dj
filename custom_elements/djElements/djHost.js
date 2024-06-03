const djHostTemplate = document.createElement('template');
djHostTemplate.innerHTML = `
    <style> 
        .hide {
            display: none !important;
        }

        dj-host {
             width: 100%;
             background: white;
             height: 40px;
             padding: 5px;
        }

        .dj-host-inner-container {
            width: 100%;
            height: 100%;
            /* flex setup */
            display: flex;
            flex-direction: row; 
            justify-content: space-between;
            gap: 5px;
            align-items: stretch;
        }

        .dj-host-input{ 
            /* take remaining flex space */
            width: 1px;
            flex: 1;
            
            /* minimal styling */
            border: solid black 1px;
            background: white;
            color: black;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 24px;
        }

        .dj-host-button {
            height: 40px;
            width: 40px;
            
            /* minimal-styling */
            border-radius: 0;
            border: solid black 1px;  
            
            /* center icon */
            display: flex;
            justify-content: center;
            align-items: center;    
        }

         /* icon size for all buttons*/
        
        .dj-host-button span {
            font-size: 24px;
        }

        .option-switcher-button span {
            font-size: 24px
        }
    </style>

    <div class="dj-host-inner-container">
        <cycle-button class="dj-host-select" states='[ 
            {"name": "off", "googleIcon": "speaker", "classes": ["dj-host-button"]},
            {"name": "on", "googleIcon": "speaker", "classes": ["dj-host-button", "active"]}
        ]'></cycle-button>
        <input class="dj-host-input" type="text" value="host" name="" id=""/>  
        <cycle-button class="dj-host-connect" states='[
            {"name": "off", "googleIcon": "play_arrow", "classes":["dj-host-button", "dj-host-start-stop-button", "start"]},
            {"name": "on", "googleIcon": "stop", "classes": ["dj-host-button", "dj-host-start-stop-button", "stop"]}
        ]'></cycle-button> 
        <option-switcher class="dj-host-audio-switcher hide"></option-switcher>
    </div>
     
`;

class DjHost extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        const temp = document.importNode(djHostTemplate.content, true);
        this.appendChild(temp);
        this.$input = this.querySelector('.dj-host-input');
        // handle select audio device button press
        this.$optionSwitcher = this.querySelector('option-switcher');
        this.$selectButton = this.querySelector('.dj-host-select');
        this.$selectButton.clickCallback = () => this.toggleOptionSwitcher();
        // handle connect button press
        this._connectCallback = null; // callback method from djHostHandler class, which implements webrtc
        this.$connectButton = this.querySelector('.dj-host-connect');
        this.$connectButton.clickCallback = (state) => this.handleConnectButton(state);
        // handle delete button press
        //this.$deleteButton = this.querySelector('.dj-host-delete');
        //this.$deleteButton.clickCallback = () => this.kill();
    }
 
    toggleOptionSwitcher(){
        this.$input.classList.toggle('hide');
        this.$connectButton.classList.toggle('hide');
        //this.$deleteButton.classList.toggle('hide');
        this.$optionSwitcher.classList.toggle('hide');
    }

    handleConnectButton(state){
        // pass cycle button press up to djHostHandler class
        if(!this._connectCallback){
            return;
        }
        if(state==0){
            this._connectCallback(false);
        } else if (state==1){
            this._connectCallback(true);
        }
    }

    kill(){
        this.remove();
    }
    
    /*------------------------------------------------------------------------*/
    /* SETTER */
    /*------------------------------------------------------------------------*/
    
    set audioDevices(array){
        this.$optionSwitcher.options = array;
    }
    
    set connectCallback(func){
        this._connectCallback = func;
    }

}

customElements.define("dj-host", DjHost);
