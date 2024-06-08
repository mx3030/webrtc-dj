const djClientTemplate = document.createElement('template');
djClientTemplate.innerHTML = `
    <style> 
        .hide {
            display: none !important;
        }

        dj-client {
             width: 100%;
             background: white;
             height: 40px;
             padding: 5px;
        }

        .dj-client-inner-container {
            width: 100%;
            height: 100%;
            /* flex setup */
            display: flex;
            flex-direction: row; 
            justify-content: space-between;
            gap: 5px;
            align-items: stretch;
        }

        .dj-client-name{ 
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

            /* center text*/
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
 
        .dj-client-button {
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
        
        .dj-client-button span {
            font-size: 24px;
        }
    </style>

    <div class="dj-client-inner-container"> 
        <div class="dj-client-name"></div>  
        <cycle-button class="dj-client-connect" states='[
            {"name": "off", "googleIcon": "link", "classes": ["dj-client-button"]},
            {"name": "on", "googleIcon": "link", "classes": ["dj-client-button", "active"]}
        ]'></cycle-button>  
    </div>
     
`;

class DjClient extends HTMLElement {
    constructor(){
        super();
        this._name = null;
    }

    connectedCallback(){
        const temp = document.importNode(djClientTemplate.content, true);
        this.appendChild(temp);
        this.$name = this.querySelector('.dj-client-name');
        this.$connectButton = this.querySelector('.dj-client-connect');
        this._startCallback = null; 
        this._stopCallback = null;
        this.$connectButton.clickCallback = (state) => this.handleConnectButton(state);
        this.render();
    }
    
    handleConnectButton(state){
        if(!this._startCallback || !this._stopCallback){
            return;
        }
        if(state==0){
            this._stopCallback();
        } else if (state==1){
            this._startCallback();
        }
    }

    render(){
        this.$name.innerHTML = this._name;
    }
  
    kill(){
        this.remove();
    }
    
    /*------------------------------------------------------------------------*/
    /* SETTER */
    /*------------------------------------------------------------------------*/
    
    set name(name){
        this._name = name;
    } 

    set success(value){
        if(value){
            this.$connectButton.addClass('green');
            this.$connectButton.removeClass('red');
            this.$connectButton.removeClass('active');
        } else {
            this.$connectButton.addClass('red');
            this.$connectButton.removeClass('green');
            this.$connectButton.removeClass('active');
        }
    }

    set startCallback(func){
        this._startCallback = func;
    }

    set stopCallback(func){
        this._stopCallback = func;
    }

}

customElements.define("dj-client", DjClient);
