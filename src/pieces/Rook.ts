import Piece from './Piece';
import moves from '../utils/moves';
import { toXY } from '../utils/helpers';

import { Color, Square } from '../types/types';

const Rook = (color: Color) => {
  const piece = Piece('rook', color);
  const type = 'rook' as const;

  function isValidMove(target: Square) {
    return (
      target !== piece.current &&
      moves.vertAndLateral(toXY(piece.current))(toXY(target))
    );
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    get current() {
      return piece.current;
    },
    get domEl() {
      return piece.domEl;
    },
    get type() {
      return type;
    }
  };
};

export default Rook;
