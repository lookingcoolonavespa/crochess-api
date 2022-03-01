import Piece from './Piece';
import moves from '../moves.js';

const Bishop = (color) => {
  const piece = Piece('bishop');

  function isValidMove(target) {
    return moves.diagonal(piece.toXY(piece.current))(piece.toXY(target));
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
