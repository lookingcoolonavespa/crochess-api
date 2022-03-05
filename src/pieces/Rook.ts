import Piece from './Piece';
import moves from '../logic/moves';
import { toXY } from '../logic/helpers';

import { Color, Square } from '../types/types';

const Rook = (color: Color) => {
  const piece = Piece('rook', color);

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
    type: 'rook',
    domEl: piece.domEl
  };
};

export default Rook;
