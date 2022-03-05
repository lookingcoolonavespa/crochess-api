import game from './modules/game';

import './styles/gameboard.css';

const dom = (() => {
  const gameboardWrapper = document.querySelector('.gameboard-wrapper');

  game.init(gameboardWrapper);
})();
