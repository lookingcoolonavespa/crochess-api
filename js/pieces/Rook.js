import Piece from './Piece';
import moves from '../moves.js';

const Rook = () => {
  const piece = Piece();

  function isValidMove(square) {
    return moves.vertAndLateral(piece.current)(piece.toXY(target));
  }

  return {
    isValidMove,
    to: piece.to,
  };
};
