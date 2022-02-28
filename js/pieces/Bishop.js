import Piece from './Piece';
import moves from '../moves.js';

const Bishop = () => {
  const piece = Piece();

  function isValidMove(target) {
    return moves.diagonal(piece.toXY(piece.current))(piece.toXY(target));
  }

  return {
    isValidMove,
    to: piece.to,
  };
};

export default Bishop;
