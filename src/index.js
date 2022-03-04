import game from './game';

require('./styles/gameboard.css');

const dom = (() => {
  const gameboardWrapper = document.querySelector('.gameboard-wrapper');

  game.init(gameboardWrapper);
})();
