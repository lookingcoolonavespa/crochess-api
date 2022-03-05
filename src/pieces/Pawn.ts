import Piece from './Piece';
import moves from '../logic/moves';
import { toXY, fromXY } from '../logic/helpers';

import { Color, Square, Moves } from '../types/types';

const Pawn = (color: Color) => {
  const piece = Piece('pawn', color);
  let firstMove = true;

  function getCaptureSquares() {
    const { x, y } = toXY(piece.current);
    const newY = color === 'white' ? y + 1 : y - 1;
    const captureOne = { x: x + 1, y: newY };
    const captureTwo = { x: x - 1, y: newY };

    return [fromXY(captureOne), fromXY(captureTwo)];
  }

  function isValidMove(target: Square, capturesAvailable: Moves) {
    const currentSquare = toXY(piece.current);
    const targetSquare = toXY(target);

    const onlyMovesInFront =
      color === 'white'
        ? currentSquare.y < targetSquare.y
        : currentSquare.y > targetSquare.y;
    const regularMoves =
      moves.yByN(1)(currentSquare)(targetSquare) &&
      currentSquare.x === targetSquare.x;
    const firstMoves =
      moves.yByN(2)(currentSquare)(targetSquare) &&
      currentSquare.x === targetSquare.x;

    return (
      target !== piece.current &&
      onlyMovesInFront &&
      (regularMoves ||
        (firstMove && firstMoves) ||
        capturesAvailable.indexOf(target) !== -1)
    );
  }

  return {
    color,
    isValidMove,
    getCaptureSquares,
    to: (square: Square, initialPlacement: boolean) => {
      if (!initialPlacement) firstMove = false;
      piece.to(square);
    },
    domEl: piece.domEl,
    type: 'pawn'
  };
};

export default Pawn;
