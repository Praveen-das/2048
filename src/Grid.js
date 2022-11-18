import Cell from "./Cell"

const GRID_SIZE = 4 
const CELL_SIZE = 10
const CELL_GAP = 1

export default class Grid {
    #cells
    #canMove
    #locked
    #promises = []
    constructor(container) {
        container.style.setProperty('--gridSize', GRID_SIZE)
        container.style.setProperty('--cellSize', `${CELL_SIZE}vmin`)
        container.style.setProperty('--cellGap', `${CELL_GAP}vmin`)

        this.#cells = generateCell(container).map((cell, index) => {
            const x = index % GRID_SIZE
            const y = Math.floor(index / GRID_SIZE)
            return new Cell(cell, x, y)
        })
    }

    get cells() {
        return this.#cells
    }

    get emptyCells() {
        return this.#cells.filter(cell => cell.tile == null)
    }

    generateRandomCell() {
        const random = Math.floor(Math.random() * this.emptyCells.length)
        return this.emptyCells[random]
    }

    get cellByColumns() {
        return this.#cells.reduce((group, cell) => {
            group[cell.x] = group[cell.x] || []
            group[cell.x][cell.y] = cell
            return group
        }, [])
    }

    get cellByRows() {
        return this.#cells.reduce((group, cell) => {
            group[cell.y] = group[cell.y] || []
            group[cell.y][cell.x] = cell
            return group
        }, [])
    }

    get canMove() {
        return this.#canMove
    }

    set canMove(value) {
        this.#canMove = value
    }

    get locked() {
        return this.#locked
    }
    
    set locked(value) {
        this.#locked = value
    }

    set promises(value){
        this.#promises.push(value)
    }

    get promises(){
        return this.#promises
    }
    
    slideTile(cellGroup) {
        let promis = Promise.all(
            cellGroup.flatMap(cells => {
                for (let i = 1; i < cells.length; i++) {
                    let cell = cells[i]
                    if (cell.tile == null) continue
                    let availableCell

                    for (let j = i - 1; j >= 0; j--) {
                        let marker = cells[j]
                        if (!marker.canAccept(cell.tile)) break
                        availableCell = marker
                    }
                    if (availableCell != null) {
                        this.promises=cell.tile.transitionEnd()
                        if (availableCell.tile != null) {
                            availableCell.mergeTile = cell.tile
                        } else {
                            availableCell.tile = cell.tile
                        }
                        cell.tile = undefined
                    }
                }
                return this.promises
            })
        )
        return promis
    }

}

function generateCell(container) {
    const cells = []

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cells.push(cell)
        container.append(cell)
    }
    return cells
}

// const random = () => {
//     return Math.floor(Math.random() * 4)
// }

// function computedValue(elm) {
//     let value = getComputedStyle(elm).transform.split(/[^0-9]/g).filter(o => o)
//     return { x: parseInt(value[4]), y: parseInt(value[5]) }
// }



// get position() {
    //     const array = []
    //     document.querySelectorAll('#cube').forEach(o => {
    //         let top = getComputedStyle(o).top
    //         let left = getComputedStyle(o).left
    //         array.push({
    //             x: parseInt(left),
    //             y: parseInt(top)
    //         })
    //     })
    //     return array
    // }

    // generate() {
    //     if (document.querySelectorAll('#cube').length === 25) return
    //     const cube = document.createElement('div')
    //     const x = random()
    //     const y = random()

    //     if (this.position.find(elm => (
    //         JSON.stringify(elm) === JSON.stringify({ x: x, y: y })
    //     )))
    //         return this.generate()

    //     cube.setAttribute('data-value', 2)
    //     cube.setAttribute('data-data', 2)
    //     cube.id = 'cube'
    //     cube.style.setProperty('--x', x + 'px')
    //     cube.style.setProperty('--y', y + 'px')
    //     document.getElementById('board').appendChild(cube)
    //     return
    // }

    // moveUp() {
    //     this.updatePosition('up')
    // }

    // moveDown() {
    //     this.updatePosition('down')
    // }

    // moveLeft() {
    //     this.updatePosition('left')
    // }

    // moveRight() {
    //     this.updatePosition('right')
    // }

    // async updatePosition(direction) {
    //     let array = Array.from(document.querySelectorAll('#cube'))

    //     let tiles = array.map(o => {
    //         let x = getComputedStyle(o).left
    //         let y = getComputedStyle(o).top
    //         return { x: parseInt(x), y: parseInt(y), element: o }
    //     })

    //     if (direction === 'up') {
    //         this.updateY(tiles, 0)
    //     }
    //     if (direction === 'down') {
    //         this.updateY(tiles, 300)
    //     }
    //     if (direction === 'left') {
    //         this.updateX(tiles, 0)
    //     }
    //     if (direction === 'right') {
    //         this.updateX(tiles, 400)
    //     }

    // }

    // updateX(tiles, start) {
    //     for (let y = 0; y < 500; y += 100) {
    //         let marker = (value) => {
    //             let data = value
    //             return data
    //         }
    //         for (let x = 0; x < 500; x += 100) {
    //             let tile = tiles.map(e => (e.x === x && e.y === y) && e).find(o => o !== false)

    //             if (tile) {
    //                 if (tile.x === start) {
    //                     marker(tile)
    //                     continue
    //                 }
    //                 if (!marker()) {
    //                     tile.element.style.left = `${start}px`
    //                     marker({
    //                         ...tile,
    //                         x: start
    //                     })
    //                     continue
    //                 }
    //                 if (marker().element.dataset.data === tile.element.dataset.data) {
    //                     tile.element.style.left = `${marker().x}px`
    //                     tile.element.style.zIndex = 2
    //                     tile.element.setAttribute('data-data', Math.pow(marker().element.dataset.value, 2))
    //                     setTimeout(() => {
    //                         tile.element.remove()
    //                         tile.element.classList.add('new-tile')
    //                         marker().element.setAttribute('data-value', Math.pow(tile.element.dataset.value, 2))
    //                     }, 50)
    //                 } else {
    //                     if (start === 0) {
    //                         if (marker().x + 100 === tile.x) {
    //                             marker(tile)
    //                             continue
    //                         }
    //                         tile.element.style.left = `${marker().x + 100}px`
    //                         marker({
    //                             ...marker,
    //                             x: marker().x + 100,
    //                             element: tile.element
    //                         })
    //                     } else {
    //                         if (marker().x - 100 === tile.x) {
    //                             marker(tile)
    //                             continue
    //                         }
    //                         tile.element.style.left = `${marker().x - 100}px`
    //                         marker({
    //                             ...marker,
    //                             x: marker().x + 100,
    //                             element: tile.element
    //                         })
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     setTimeout(() => {
    //         this.generate()
    //     }, 500)
    // }

    // gridX(tiles) {
    //     let tile = []
    //     for (let x = 0; x < 500; x += 100) {
    //         let data
    //         let marker = (value) => {
    //             if (value)
    //                 data = value
    //             return data
    //         }
    //         for (let y = 0; y < 500; y += 100) {
    //             tile.push(tiles.map(e => (e.x === x && e.y === y) && e).find(o => o !== false))
    //         }
    //     }
    //     console.log(tiles);
    //     console.log(tile.filter(o => o));
    // }

    // async updateY(tiles, start) {
    //     const wait = (tile) => new Promise(resolve => tile.addEventListener('transitionend', (e) => {
    //         resolve(true)
    //     }, { once: true }))
    //     for (let x = 0; x < 400; x += 100) {
    //         let data
    //         let marker = (value) => {
    //             if (value)
    //                 data = value
    //             return data
    //         }
    //         for (let y = 0; y < 400; y += 100) {
    //             let tile = tiles.map(e => (e.x === x && e.y === y) && e).find(o => o !== false)

    //             if (tile) {
    //                 if (tile.y === start) {
    //                     marker(tile)
    //                     continue
    //                 }

    //                 if (!marker()) {
    //                     tile.element.style.top = `${start}px`
    //                     marker({
    //                         ...tile,
    //                         y: start
    //                     })
    //                     continue
    //                 }

    //                 if (tile.element.dataset.value === marker().element.dataset.value) {
    //                     tile.element.style.top = `${marker().y}px`
    //                     await wait(tile.element)
    //                     tile.element.remove()
    //                     marker().element.classList.add('new-tile')
    //                     marker().element.setAttribute('data-value', marker().element.dataset.value * 2)
    //                 } else {
    //                     if (start === 0) {
    //                         if (marker().y + 100 === tile.y) {//check if there is an element in front of marker
    //                             marker(tile)
    //                             continue
    //                         }
    //                         tile.element.style.top = `${marker().y + 100}px`
    //                         marker(tile)
    //                     }

    //                     if (start === 300) {
    //                         if (marker().y - 100 === tile.y) {
    //                             marker(tile)
    //                             continue
    //                         }
    //                         tile.element.style.top = `${marker().y - 100}px`
    //                         marker({
    //                             ...marker,
    //                             y: marker().y + 100,
    //                             element: tile.element
    //                         })
    //                     }
    //                 }


    //             }
    //         }
    //     }
    //     setTimeout(() => {
    //         this.generate()
    //     }, 500)
    // }