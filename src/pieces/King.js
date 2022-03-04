import Piece from './Piece';
import moves from '../logic/moves';
import { toXY } from '../logic/helpers';

const King = (color) => {
  const piece = Piece('king', color);

  function isValidMove(target) {
    const currentSquare = toXY(piece.current);
    const targetSquare = toXY(target);

    const oneSquareOnYAxis = moves.yByN(1)(currentSquare.y)(targetSquare.y);
    const oneSquareOnXAxis = moves.xByN(1)(currentSquare.x)(targetSquare.x);
    const oneSquareDiagonally =
      moves.yByN(1)(currentSquare.y)(targetSquare.y) &&
      moves.xByN(1)(currentSquare.x)(targetSquare.x);

    return (
      target !== piece.current &&
      (oneSquareDiagonally || oneSquareOnXAxis || oneSquareOnYAxis)
    );
  }

  return {
    color,
    isValidMove,
    to: piece.to,
    type: 'king',
    domEl: piece.domEl,
  };
};

export default King;
