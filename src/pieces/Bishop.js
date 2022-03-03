import Piece from './Piece.js';
import moves from '../logic/moves.js';
import { toXY } from '../logic/helpers.js';

const Bishop = (color) => {
  const piece = Piece('bishop', color);

  function isValidMove(target) {
    return (
      target !== piece.current &&
      moves.diagonal(toXY(piece.current))(toXY(target))
    );
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    type: 'bishop',
    domEl: piece.domEl,
  };
};

export default Bishop;
