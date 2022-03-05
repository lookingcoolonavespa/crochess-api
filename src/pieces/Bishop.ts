import Piece from './Piece';
import moves from '../logic/moves';
import { toXY } from '../logic/helpers';

import { Color, Square } from '../types/types';

const Bishop = (color: Color) => {
  const piece = Piece('bishop', color);

  function isValidMove(target: Square) {
    return (
      target !== piece.current &&
      moves.diagonal(toXY(piece.current))(toXY(target))
    );
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    type: 'bishop',
    domEl: piece.domEl
  };
};

export default Bishop;