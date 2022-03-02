import Piece from './Piece.js';
import moves from '../logic/moves.js';

const Knight = (color) => {
  const piece = Piece('knight', color);

  function isValidMove(target) {
    const currentSquare = piece.toXY(piece.current);
    const targetSquare = piece.toXY(target);
    return (
      (moves.xByN(1)(currentSquare)(targetSquare) &&
        moves.yByN(2)(currentSquare)(targetSquare)) ||
      (moves.xByN(2)(currentSquare)(targetSquare) &&
        moves.yByN(1)(currentSquare)(targetSquare))
    );
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    type: 'knight',
    domEl: piece.domEl,
  };
};

export default Knight;
