import Piece from './Piece';
import moves from '../moves.js';

const Rook = (color) => {
  const piece = Piece();

  function isValidMove(target) {
    return moves.vertAndLateral(piece.toXY(piece.current))(piece.toXY(target));
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    type: 'rook',
    domEl: piece.domEl,
  };
};

export default Rook;
