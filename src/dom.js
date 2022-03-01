import Gameboard from './Gameboard.js';

const dom = (() => {
  const gameboardWrapper = document.querySelector('.gameboard-wrapper');
  createGameboard();

  function createGameboard() {
    const domBoard = document.createElement('div');
    domBoard.setAttribute('class', 'gameboard');

    const gameboard = Gameboard();
    const allSquares = Object.keys(gameboard.board);
    const columnCount = Math.sqrt(allSquares.length);
    console.log(columnCount);
    for (let i = 0; i < columnCount; i++) {
      const gridCol = document.createElement('div');
      gridCol.setAttribute('class', 'grid-col');
      const colStart = i * columnCount;
      const colEnd = (i + 1) * columnCount - 1;
      allSquares.slice(colStart, colEnd).forEach((square) => {
        const domSquare = document.createElement('div');
        domSquare.setAttribute('class', 'boardSquare');
        domSquare.style.gridArea = square;
        gridCol.append(domSquare);
      });
      domBoard.append(gridCol);
    }

    gameboardWrapper.append(domBoard);
  }
})();
