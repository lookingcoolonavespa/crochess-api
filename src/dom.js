import game from './game.js';

const dom = (() => {
  const gameboardWrapper = document.querySelector('.gameboard-wrapper');

  game.init(gameboardWrapper);
})();
