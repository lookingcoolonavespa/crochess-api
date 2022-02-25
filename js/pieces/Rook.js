import Piece from './Piece';
import moves from '../moves.js';

const Rook = () => {
  const piece = Piece();

  function isValidMove(target) {
    return moves.vertAndLateral(piece.toXY(piece.current))(piece.toXY(target));
  }

  return {
    isValidMove,
    to: piece.to,
  };
};

export default Rook;
