export default class Tile {
    #x
    #y
    #value
    #tileElement
 
    constructor(container, value = 2) {
        this.#tileElement = document.createElement('div')
        this.#tileElement.className = 'tile'
        this.value = value
        container.append(this.#tileElement)
    }

    get value() {
        return this.#value
    }

    #hue = 60
    #lightness = 100

    set hue(value){
        this.#hue = value
    }
    get hue(){
        return this.#hue
    }
    set lightness(value){
        this.#lightness = value
    }
    get lightness(){
        return this.#lightness
    }

    set value(v) {
        this.#value = v
        this.lightness  = 100 - Math.log2(v) * 5 
        this.#tileElement.textContent = v

        if(this.lightness <= 70){
            this.hue += 10
        }
        this.#tileElement.style.setProperty('--lightness',`${this.lightness}%`)
        this.#tileElement.style.setProperty('--hue',this.hue)
        
        if(v === 2048)
        this.#tileElement.classList.add('goal')
    }

    set x(value) {
        this.#x = value
        this.#tileElement.style.setProperty('--x', this.#x)
    }

    set y(value) {
        this.#y = value
        this.#tileElement.style.setProperty('--y', this.#y)
    }

    get element(){
        return this.#tileElement
    }

    transitionEnd() {
        return new Promise(res => {
            this.#tileElement.ontransitionend = () => res(true)
        })
    }

    remove() {
        this.#tileElement.remove()
    }
}