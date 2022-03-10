import Piece from './Piece';
import moves from '../logic/moves';
import { toXY } from '../logic/helpers';

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
    current: piece.current,
    get domEl() {
      return piece.domEl;
    },
    get type() {
      return type;
    }
  };
};

export default Queen;
