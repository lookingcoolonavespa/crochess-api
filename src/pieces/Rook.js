import Piece from './Piece.js';
import moves from '../moves.js';

const Rook = (color) => {
  const piece = Piece('rook', color);

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
