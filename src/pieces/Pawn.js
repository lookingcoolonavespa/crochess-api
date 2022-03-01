import Piece from './Piece';
import moves from '../moves.js';
import { toXY, fromXY } from '../helpers';

const Pawn = (color) => {
  const piece = Piece('pawn');
  let firstMove = true;

  function getCaptureSquares() {
    const { x, y } = toXY(piece.current);
    const newY = color === 'white' ? y + 1 : y - 1;
    const captureOne = { x: x + 1, y: newY };
    const captureTwo = { x: x - 1, y: newY };

    return [fromXY(captureOne), fromXY(captureTwo)];
  }

  function isValidMove(target, capturesAvailable) {
    const currentSquare = piece.toXY(piece.current);
    const targetSquare = piece.toXY(target);

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

    if (target === 'd3') console.log(capturesAvailable.indexOf(target) !== -1);
    return (
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
    to: (square, initialPlacement) => {
      if (!initialPlacement) firstMove = false;
      piece.to(square);
    },
    domEl: piece.domEl,
    type: 'pawn',
  };
};

export default Pawn;
