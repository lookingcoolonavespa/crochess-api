import { toXY } from '../helpers';

const Piece = () => {
  let current;

  const domNode = document.createElement('div');
  domNode.classList.add('chess-piece');

  let domEl = () => domNode;

  function to(square) {
    current = square;
  }

  return {
    domEl,
    to,
    get current() {
      return current;
    },
    toXY,
  };
};

export default Piece;
