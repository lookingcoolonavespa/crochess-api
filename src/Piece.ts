import moves from './utils/moves';
import { toXY, fromXY } from './utils/helpers';

import { Color, Square, PieceType } from './types/types';

const Piece = (color: Color, type: PieceType) => {
  function hasMove(from: Square, to: Square) {
    switch (type) {
      case 'king': {
        const oneSquareVert =
          moves.yByN(1)(from)(to) && moves.xByN(0)(from)(to);
        const oneSquareLateral =
          moves.xByN(1)(from)(to) && moves.yByN(0)(from)(to);
        const oneSquareDiagonally =
          moves.yByN(1)(from)(to) && moves.xByN(1)(from)(to);

        return (
          from !== to &&
          (oneSquareDiagonally || oneSquareVert || oneSquareLateral)
        );
      }
      case 'queen': {
        return (
          from !== to &&
          (moves.diagonal(from)(to) || moves.vertAndLateral(from)(to))
        );
      }
      case 'bishop': {
        return from !== to && moves.diagonal(from)(to);
      }
      case 'knight': {
        return (
          from !== to &&
          ((moves.xByN(1)(from)(to) && moves.yByN(2)(from)(to)) ||
            (moves.xByN(2)(from)(to) && moves.yByN(1)(from)(to)))
        );
      }
      case 'rook': {
        return from !== to && moves.vertAndLateral(to)(from);
      }
      case 'pawn': {
        const { x: x1, y: y1 } = toXY(from);
        const { x: x2, y: y2 } = toXY(to);

        const onlyMovesInFront = color === 'white' ? y1 < y2 : y1 > y2;
        const regularMove = moves.yByN(1)(from)(to) && x1 === x2;

        const firstMove = color === 'white' ? y1 === 2 : y1 === 7;
        const jumpTwo = moves.yByN(2)(from)(to) && x1 === x2;

        return (
          from !== to &&
          onlyMovesInFront &&
          (regularMove || (firstMove && jumpTwo))
        );
      }
    }
  }

  function getPawnCaptures(origin: Square) {
    if (type !== 'pawn') return;

    const { x, y } = toXY(origin);

    const newY = color === 'white' ? y + 1 : y - 1;

    const captureOne = { x: x + 1, y: newY };
    const captureTwo = { x: x - 1, y: newY };

    return [fromXY(captureOne), fromXY(captureTwo)];
  }

  return {
    hasMove,
    getPawnCaptures,
    get type() {
      return type;
    },
    get color() {
      return color;
    }
  };
};

export default Piece;
