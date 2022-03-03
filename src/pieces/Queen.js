import Piece from './Piece.js';
import moves from '../logic/moves.js';
import { toXY } from '../logic/helpers.js';

const Queen = (color) => {
  const piece = Piece('queen', color);

  function isValidMove(target) {
    const currentSquare = toXY(piece.current);
    const targetSquare = toXY(target);
    return (
      target !== piece.current &&
      (moves.diagonal(currentSquare)(targetSquare) ||
        moves.vertAndLateral(currentSquare)(targetSquare))
    );
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    type: 'queen',
    domEl: piece.domEl,
  };
};

export default Queen;
