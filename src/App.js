import React, { useEffect, useRef, useState } from 'react';
import './app.css'
import Grid from './Grid.js';
import Tile from './Tile';

function canMove(cellGroup) {
  return cellGroup.some(cells => {
    return cells.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const marker = cells[index - 1]
      return marker.canAccept(cell.tile)
    })
  })
}

let promises
let moving = false

async function handleInput(e, grid, generateRandomCell) {
  let arrow = true
  let gridCanMove

  if (moving) return

  switch (e.key) {
    case 'ArrowUp':
      gridCanMove = canMove(grid.cellByColumns)
      moving = true
      await grid.slideTile(grid.cellByColumns)
      break;
    case 'ArrowDown':
      gridCanMove = canMove(grid.cellByColumns.map(o => [...o].reverse()))
      moving = true
      await grid.slideTile(grid.cellByColumns.map(o => [...o].reverse()))
      break;
    case 'ArrowLeft':
      gridCanMove = canMove(grid.cellByRows)
      moving = true
      await grid.slideTile(grid.cellByRows)
      break;
    case 'ArrowRight':
      gridCanMove = canMove(grid.cellByRows.map(o => [...o].reverse()))
      moving = true
      await grid.slideTile(grid.cellByRows.map(o => [...o].reverse()))
      break;
    default:
      arrow = false
      moving = true
      break;
  }

  if (!arrow) return
  moving = false
  grid.cells.forEach(cell => cell.mergeTiles())
  gridCanMove && generateRandomCell()

  await new Promise(res => {
    Array.from(document.getElementsByClassName('tile')).forEach(e => {
      e.addEventListener('animationend', res)
    })
  })

  if ((canMove(grid.cellByColumns) ||
    canMove(grid.cellByColumns.map(o => [...o].reverse())) ||
    canMove(grid.cellByRows) ||
    canMove(grid.cellByRows.map(o => [...o].reverse()))) == false
  ) {
    alert('you loose')
  }

  if (grid.cells.find(cell => cell.tile?.value === 2048)) {
    alert('you won')
  }

}

function App() {
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) return () => mounted.current = true
    const board = document.getElementById('board')
    const grid = new Grid(board)
    const generateRandomCell = () => {
      grid.generateRandomCell().tile = new Tile(board)
    }
    generateRandomCell()
    generateRandomCell()

    onkeyup = async (e) => {
      handleInput(e, grid, generateRandomCell)
    }

    function pointerMove(e) {
      if (e.movementX > 20)
        console.log('swipe left');
      if (e.movementX < -20)
        console.log('swipe right');
      if (e.movementY > 20)
        console.log('swipe to bottom');
      if (e.movementY < -20)
        console.log('swipe to top');

    }

    onpointerdown = () => {
      document.addEventListener('pointermove', pointerMove)
    }
    onpointerup = () => {
      document.removeEventListener('pointermove', pointerMove)
    }

  }, [])
  return (
    <div id="board"></div>
  );
}

export default App;
