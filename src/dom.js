import Gameboard from './Gameboard.js';

const dom = (() => {
  const gameboardWrapper = document.querySelector('.gameboard-wrapper');
  createGameboard();

  function createGameboard() {
    const domBoard = document.createElement('div');
    domBoard.setAttribute('class', 'gameboard');
    const gameboard = Gameboard();
    const allSquares = Object.keys(gameboard.board);
    allSquares.forEach((square) => {
      const domSquare = document.createElement('div');
      domSquare.setAttribute('class', 'boardSquare');
      domSquare.style.gridArea = square;
      domBoard.append(domSquare);
    });
    gameboardWrapper.append(domBoard);
  }
})();
