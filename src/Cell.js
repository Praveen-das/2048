export default class Cell {
    #x
    #y
    #element
    #tile
    #mergeTile

    constructor(element, x, y) {
        this.#element = element
        this.#x = x
        this.#y = y
    }
    
    get element(){
        return this.#element
    }

    get x() {
        return this.#x
    }

    get y() {
        return this.#y
    }

    get tile() {
        return this.#tile
    }

    set tile(value) {
        this.#tile = value
        if (value == null) return
        this.#tile.x = this.#x
        this.#tile.y = this.#y
    }

    get mergeTile(){
        return this.#mergeTile
    }

    set mergeTile(value){
        this.#mergeTile = value
        if(value == null) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
    }
    
    canAccept(tile) {
        return this.#tile == null ||
            (this.#mergeTile == null && tile.value === this.#tile.value)
    }
    
    mergeTiles(){
        if(this.tile == null || this.mergeTile == null) return
        this.tile.value = this.tile.value + this.mergeTile.value
        this.#mergeTile.remove()
        this.#mergeTile = null
    }

}