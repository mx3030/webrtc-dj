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
        <div class="dj-client-name">client</div>  
        <cycle-button class="dj-client-connect" states='[
            {"name": "off", "googleIcon": "link", "classes": ["dj-client-button"]},
            {"name": "on", "googleIcon": "link_off", "classes": ["dj-client-button"]}
        ]'></cycle-button> 
        <cycle-button class="dj-client-sound" states='[ 
            {"name": "off", "googleIcon": "volume_up", "classes": ["dj-client-button"]},
            {"name": "on", "googleIcon": "volume_off", "classes": ["dj-client-button"]}
        ]'></cycle-button> 
    </div>
     
`;

class DjClient extends HTMLElement {
    constructor(){
        super();
    }

    connectedCallback(){
        const temp = document.importNode(djClientTemplate.content, true);
        this.appendChild(temp);
        this.$name = this.querySelector('.dj-client-name');
        this._name = this.$name.innerHTML;
        
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

}

customElements.define("dj-client", DjClient);
