import Piece from './Piece';
import moves from '../logic/moves';
import { toXY } from '../logic/helpers';

import { Color, Square } from '../types/types';

const Knight = (color: Color) => {
  const piece = Piece('knight', color);

  function isValidMove(target: Square) {
    const currentSquare = toXY(piece.current);
    const targetSquare = toXY(target);
    return (
      target !== piece.current &&
      ((moves.xByN(1)(currentSquare)(targetSquare) &&
        moves.yByN(2)(currentSquare)(targetSquare)) ||
        (moves.xByN(2)(currentSquare)(targetSquare) &&
          moves.yByN(1)(currentSquare)(targetSquare)))
    );
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    type: 'knight',
    domEl: piece.domEl
  };
};

export default Knight;