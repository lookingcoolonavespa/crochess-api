const moves = {
  vertAndLateral:
    ({ x: x1, y: y1 }) =>
    ({ x: x2, y: y2 }) =>
      x1 === x2 || y1 === y2,
  diagonal:
    ({ x: x1, y: y1 }) =>
    ({ x: x2, y: y2 }) =>
      Math.abs(x2 - x1) === Math.abs(y2 - y1),
  xByN:
    (num) =>
    ({ x: x1 }) =>
    ({ x: x2 }) =>
      Math.abs(x1 - x2) === num,
  yByN:
    (num) =>
    ({ y: y1 }) =>
    ({ y: y2 }) =>
      Math.abs(y1 - y2) === num,
};

export default moves;

function splitIntoVectors(arrayOfMoves, startSquare) {
  return arrayOfMoves.reduce((acc, curr) => {
    const { x: x1, y: y1 } = toXY(startSquare);
    const { x: x2, y: y2 } = toXY(curr);

    const xDiff = x1 - x2;
    const yDiff = y1 - y2;

    if (yDiff > 0) {
      switch (true) {
        case xDiff > 0: {
          acc.upRightDiagonal = acc.upRightDiagonal || [];
          acc.upRightDiagonal.push(curr);
          break;
        }
        case xDiff < 0: {
          acc.upLeftDiagonal = acc.upLeftDiagonal || [];
          acc.upLeftDiagonal.push(curr);
          break;
        }
        case xDiff === 0: {
          acc.up = acc.up || [];
          acc.up.push(curr);
        }
      }
    } else {
      switch (true) {
        case xDiff > 0: {
          acc.downRightDiagonal = acc.downRightDiagonal || [];
          acc.downRightDiagonal.push(curr);
          break;
        }
        case xDiff < 0: {
          acc.downLeftDiagonal = acc.downLeftDiagonal || [];
          acc.downLeftDiagonal.push(curr);
          break;
        }
        case xDiff === 0: {
          acc.down = acc.down || [];
          acc.down.push(curr);
        }
      }
    }

    return acc;
  }, {});
}

function sortMovesByClosest(moves, startSquare) {
  return [...moves].sort((a, b) => {
    const { x, y } = toXY(startSquare);
    const { x: x1, y: y1 } = toXY(a);
    const { x: x2, y: y2 } = toXY(b);

    const x1Diff = x - x1;
    const y1Diff = y - y1;
    const aDiff = Math.abs(x1Diff) + Math.abs(y1Diff);

    const x2Diff = x - x2;
    const y2Diff = y - y2;
    const bDiff = Math.abs(x2Diff) + Math.abs(y2Diff);

    return aDiff - bDiff;
  });
}

function getAllPossibleMoves(piece, board) {
  return board.filter((s) => {
    if (piece.type === 'pawn') {
      const captureSquares = piece.getCaptureSquares();
      const capturesAvailable = captureSquares.filter(
        (s) => board[s].piece && board[s].piece.color !== piece.color
      );
      return s !== square && piece.isValidMove(s, capturesAvailable);
    }
    return s !== square && piece.isValidMove(s);
  });
}

function removeMovesBehindPiece(moves, pieceSquare, enemy) {
  const copy = [...moves];
  const indexOfObstruction = moves.indexOf(pieceSquare);
  if (indexOfObstruction === -1) return;
  const indexToSplice = enemy ? indexOfObstruction + 1 : indexOfObstruction;
  copy.splice(indexToSplice);
  return copy;
}

export {
  splitIntoVectors,
  sortMovesByClosest,
  getAllPossibleMoves,
  removeMovesBehindPiece,
};
