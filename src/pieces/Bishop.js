import Piece from './Piece';
import moves from '../logic/moves';
import { toXY } from '../logic/helpers';

const Bishop = (color) => {
  const piece = Piece('bishop', color);

  function isValidMove(target) {
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
    domEl: piece.domEl,
  };
};

export default Bishop;
