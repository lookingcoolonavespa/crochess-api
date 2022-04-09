import Piece from './Piece';
import moves from '../utils/moves';
import { toXY } from '../utils/helpers';

import { Color, Square } from '../types/types';

const Queen = (color: Color) => {
  const piece = Piece('queen', color);
  const type = 'queen' as const;

  function isValidMove(target: Square) {
    const currentSquare = toXY(piece.current);
    const targetSquare = toXY(target);
    return (
      target !== piece.current &&
      (moves.diagonal(currentSquare)(targetSquare) ||
        moves.vertAndLateral(currentSquare)(targetSquare))
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

export default Queen;
