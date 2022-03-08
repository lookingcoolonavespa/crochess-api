import Piece from './Piece';
import moves from '../logic/moves';
import { toXY } from '../logic/helpers';

import { Color, Square } from '../types/types';

const King = (color: Color) => {
  const piece = Piece('king', color);
  const type = 'king' as const;

  function isValidMove(target: Square) {
    const currentSquare = toXY(piece.current);
    const targetSquare = toXY(target);

    const oneSquareUpDown =
      moves.yByN(1)(currentSquare)(targetSquare) &&
      moves.xByN(0)(currentSquare)(targetSquare);
    const oneSquareLeftRight =
      moves.xByN(1)(currentSquare)(targetSquare) &&
      moves.yByN(0)(currentSquare)(targetSquare);
    const oneSquareDiagonally =
      moves.yByN(1)(currentSquare)(targetSquare) &&
      moves.xByN(1)(currentSquare)(targetSquare);

    return (
      target !== piece.current &&
      (oneSquareDiagonally || oneSquareUpDown || oneSquareLeftRight)
    );
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    get domEl() {
      return piece.domEl;
    },
    get type() {
      return type;
    }
  };
};

export default King;
