import Piece from './Piece';
import moves from '../logic/moves';
import { toXY } from '../logic/helpers';

const Rook = (color) => {
  const piece = Piece('rook', color);

  function isValidMove(target) {
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
    domEl: piece.domEl,
  };
};

export default Rook;
