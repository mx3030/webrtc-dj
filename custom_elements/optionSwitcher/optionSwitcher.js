const optionSwitcherTemplate = document.createElement('template');
optionSwitcherTemplate.innerHTML = ` 
    <style>
        option-switcher {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
        }

        .option-switcher-name {
            /* take remaining flex space */
            width: 1px;
            flex: 1;
            
            /* minimal styling */
            padding-left: 5px;
            padding-right: 5px;
            border: solid black 1px;
            border-left: none; 
            border-right: none;
            
            /* overflow handling */
            white-space: nowrap;
            overflow-x: auto;
            
            /* center text */
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }
        
        /* hide scrollbar */

        .option-switcher-name::-webkit-scrollbar {
            display: none;
        }

        .option-switcher-name {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .option-switcher-button {
            height: 100%;
            width: 30px;
            
            /* center icon */
            display: flex; 
            justify-content: center;
            align-items: center;
            
            /* minimal styling */
            border-radius: 0;
            border: solid black 1px;
        }

    </style>
    
    <cycle-button class="option-switcher-cycle-button left" states='[
        {"name": "left", "googleIcon": "chevron_left", "classes": ["option-switcher-button"]}
    ]'></cycle-button>
    <div class="option-switcher-name"></div>
    <cycle-button class="option-switcher-cycle-button right" states='[
        {"name": "right", "googleIcon": "chevron_right", "classes": ["option-switcher-button"]}
    ]'></cycle-button>
`;

class OptionSwitcher extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const temp = document.importNode(optionSwitcherTemplate.content, true);
        this.appendChild(temp);

        // handle render
        this.$optionName = this.querySelector('.option-switcher-name');
        this._options = JSON.parse(this.getAttribute('options')) || [''];
        this._index = 0;
        this.render();

        // handle button clicks
        this.$leftButton = this.querySelector('.option-switcher-cycle-button.left');
        this.$leftButton.clickCallback = () => this.prevOption();

        this.$rightButton = this.querySelector('.option-switcher-cycle-button.right');
        this.$rightButton.clickCallback = () => this.nextOption();
    }

    prevOption() {
        if (this._options.length > 0) {
            this._index = (this._index - 1 + this._options.length) % this._options.length;
            this.render();
        }
    }

    nextOption() {
        if (this._options.length > 0) {
            this._index = (this._index + 1) % this._options.length;
            this.render();
        }
    }

    render() {
        if (this._options.length > 0) {
            this.$optionName.innerHTML = this._options[this._index];
        }
    }
    
    /*------------------------------------------------------------------------*/
    /* Getter */
    /*------------------------------------------------------------------------*/
    
    get option(){
        return this._options[this._index];
    }

    get index(){
        return this._index;
    }

    /*------------------------------------------------------------------------*/
    /* SETTER */
    /*------------------------------------------------------------------------*/

    set options(array) {
        this._options = array;
        this._index = 0; 
        this.render();
    }
}

customElements.define('option-switcher', OptionSwitcher);
