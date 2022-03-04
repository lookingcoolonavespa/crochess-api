import { calcDistance, toXY } from './helpers';

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
    const { xDiff, yDiff } = calcDistance(startSquare)(curr);

    let vector = '';
    if (yDiff !== 0) vector = yDiff < 0 ? 'up' : 'down';
    if (xDiff !== 0) vector += xDiff < 0 ? 'Right' : 'Left';
    vector = vector.charAt(0).toLowerCase() + vector.slice(1);

    acc[vector] = acc[vector] || [];
    acc[vector].push(curr);

    return acc;
  }, {});
}

const sortMovesClosestTo = (square) => (moves) => {
  return [...moves].sort((a, b) => {
    const { xDiff: x1Diff, yDiff: y1Diff } = calcDistance(square)(a);
    const aDiff = Math.abs(x1Diff) + Math.abs(y1Diff);

    const { xDiff: x2Diff, yDiff: y2Diff } = calcDistance(square)(b);
    const bDiff = Math.abs(x2Diff) + Math.abs(y2Diff);

    return aDiff - bDiff;
  });
};

function getPossibleMoves(piece, board) {
  const allSquares = Array.from(board.keys());
  return allSquares.filter((s) => {
    if (piece.type === 'pawn') {
      const captureSquares = piece.getCaptureSquares();
      const capturesAvailable = captureSquares.filter(
        (s) => board.get(s).piece && board.get(s).piece.color !== piece.color
      );
      return piece.isValidMove(s, capturesAvailable);
    }
    return piece.isValidMove(s);
  });
}

const removeMovesBehindSquare = (square) => (moves) => {
  const copy = [...moves];
  const index = moves.indexOf(square);

  if (index === -1) return;

  copy.splice(index + 1);

  return copy;
};

function removeBlockedMoves(startingSquare, allPossible, obstructions) {
  let filteredMoves = [];

  const allVectors = splitIntoVectors(allPossible, startingSquare);
  const obstructionVectors = splitIntoVectors(obstructions, startingSquare);
  for (const vector in allVectors) {
    if (!obstructionVectors[vector]) {
      filteredMoves.push(allVectors[vector]);
      continue;
    }

    const sorted = sortMovesClosestTo(startingSquare)(allVectors[vector]);
    const closestObstruction = sortMovesClosestTo(startingSquare)(
      obstructionVectors[vector]
    )[0];

    filteredMoves.push(removeMovesBehindSquare(closestObstruction)(sorted));
  }

  return filteredMoves.flat();
}

function removeMovesWithOwnPieces(moves, board, ownColor) {
  return moves.filter((s) => {
    return !board.get(s).piece || board.get(s).piece.color !== ownColor;
  });
}

function getValidMoves(square, board) {
  const piece = board.get(square).piece;
  const allPossible = getPossibleMoves(piece, board);
  const obstructions = allPossible.filter((s) => board.get(s).piece);
  if (!obstructions.length) return allPossible;

  const unblockedMoves =
    piece.type === 'knight'
      ? allPossible
      : removeBlockedMoves(square, allPossible, obstructions);

  return removeMovesWithOwnPieces(unblockedMoves, board, piece.color);
}

const getMovesAlongVector = (squareOne, squareTwo, board) => {
  const liesSameVertOrLat = moves.vertAndLateral(toXY(squareOne))(
    toXY(squareTwo)
  );
  const liesSameDiagonally = moves.diagonal(toXY(squareOne))(toXY(squareTwo));
  const liesOnSameLine = liesSameVertOrLat || liesSameDiagonally;
  if (!liesOnSameLine) return false;

  const matchingVector = liesSameDiagonally ? 'diagonal' : 'vertAndLateral';
  const squaresAlongVector = board.filter(
    (s) =>
      s !== squareOne &&
      s !== squareTwo &&
      moves[matchingVector](toXY(squareOne))(toXY(s)) &&
      moves[matchingVector](toXY(squareTwo))(toXY(s))
  );

  return squaresAlongVector;
};

function calcDiscoveredCheck(kingPosition, openSquare, board) {
  const squaresAlongVector = getMovesAlongVector(
    kingPosition,
    openSquare,
    Array.from(board.keys())
  );

  if (!squaresAlongVector) return false;

  const kingColor = board.get(kingPosition).piece.color;

  for (const square of squaresAlongVector) {
    const piece = board.get(square).piece;
    if (!piece || piece.color === kingColor) continue;
    const validMoves = getValidMoves(square, board);
    console.log(validMoves);
    if (validMoves.indexOf(kingPosition) !== -1) return true;
  }

  return false;
}

export { getValidMoves, calcDiscoveredCheck };
