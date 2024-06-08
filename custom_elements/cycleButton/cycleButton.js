const cycleButtonTemplate = document.createElement('template');
cycleButtonTemplate.innerHTML = ` 
    <button></button>
`;

class CycleButton extends HTMLElement {
    constructor() {
        super();     
    }

    connectedCallback(){
        const temp = document.importNode(cycleButtonTemplate.content, true);
        this.appendChild(temp);
        // render button
        this.$button = this.querySelector('button');
        this._state = parseInt(this.getAttribute('state')) || 0;
        this._states = JSON.parse(this.getAttribute('states')) || [''];
        this.render();
        // handle button click
        this._listen = true;
        this._clickCallback = null;
        this.addEventListener('click', () => {
            if(this._listen){
                this.nextState();
                if(this._clickCallback){
                    this._clickCallback(this.state)
                }
            }
        });
    }
        
    nextState() {
        if (this._states.length > 0) {
            this._state = (this._state + 1) % this._states.length;
            this.render();
        }
    } 

    addClass(string){
        this.$button.classList.add(string);
    }

    removeClass(string){
        this.$button.classList.remove(string);
    }

    render() {
        if (this._states.length > 0) {
            const currentState = this._states[this._state];
            this.$button.innerHTML = '';
            if(currentState["googleIcon"]){
                this.$button.innerHTML = `<span class="material-symbols-outlined">${currentState["googleIcon"]}</span>`;
            } else if(currentState["svg"]){
                this.$button.innerHTML = currentState["svg"];
            }
            this.$button.className = '';
            currentState.classes.forEach(cls => this.$button.classList.add(cls));
        }
    }
  
    /*------------------------------------------------------------------------*/
    /* GETTER */
    /*------------------------------------------------------------------------*/

    get state(){
        return this._state;
    }

    get states(){
        return this._states;
    }

    get name() {
        return this._states[this._state]["name"]
    }

    get data() {
        return this._states[this._state]["data"]
    }
    
    /*------------------------------------------------------------------------*/
    /* SETTER */
    /*------------------------------------------------------------------------*/
    
    set listen(value){
        this._listen = value; 
    } 

    set state(index){
        this._state = ((index % this._states.length) + this._states.length) % this._states.length;
        this.render();
    }

    set states(array){
        this._states = array;
        this._state = 0;
        this.render();
    }
 
    set clickCallback(func){
        this._clickCallback = func;
    }

}

customElements.define('cycle-button', CycleButton);


/*----------------------------------------------------------------------------*/
/* additional information */
/*----------------------------------------------------------------------------*/

// for working with svg
// echo '"<svg-string>"' | sed 's/"/\\"/g'
