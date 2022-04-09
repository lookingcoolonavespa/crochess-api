import { calcDistance, toXY } from './helpers';
import { Coord, xCoord, yCoord, Piece, Pawn } from '../types/interfaces';
import { Moves, Board, Square, Color } from '../types/types';

const moves = {
  vertAndLateral: (from: Square) => (to: Square) => {
    const [x1, y1] = from.split('');
    const [x2, y2] = to.split('');
    return x1 === x2 || y1 === y2;
  },
  diagonal: (from: Square) => (to: Square) => {
    const { x: x1, y: y1 } = toXY(from);
    const { x: x2, y: y2 } = toXY(to);
    return Math.abs(x2 - x1) === Math.abs(y2 - y1);
  },
  xByN: (num: number) => (from: Square) => (to: Square) => {
    const { x: x1 } = toXY(from);
    const { x: x2 } = toXY(to);
    return Math.abs(x1 - x2) === num;
  },
  yByN: (num: number) => (from: Square) => (to: Square) => {
    const { y: y1 } = toXY(from);
    const { y: y2 } = toXY(to);
    return Math.abs(y1 - y2) === num;
  }
};

export default moves;

/* dealing with move vectors */

function splitIntoVectors(arrayOfMoves: Moves, startSquare: Square) {
  interface Vectors {
    [key: string]: string[];
  }
  return arrayOfMoves.reduce((acc: Vectors, curr) => {
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

function getBeginningOfVector(vector: Moves) {
  if (vector.length === 0) return '';
  return vector.reduce((acc, curr) => {
    const { x: x1, y: y1 } = toXY(acc);
    const { x: x2, y: y2 } = toXY(curr);

    const accIsBeginning = x1 === x2 ? y1 < y2 : x1 < x2;
    return accIsBeginning ? acc : curr;
  });
}

const getMovesAlongVector = (
  squareOne: Square,
  squareTwo: Square,
  allSquares: Moves
): Moves => {
  const liesSameVertOrLat = moves.vertAndLateral(squareOne)(squareTwo);
  const liesSameDiagonally = moves.diagonal(squareOne)(squareTwo);
  const liesOnSameLine = liesSameVertOrLat || liesSameDiagonally;
  if (!liesOnSameLine) return [];

  const matchingVector = liesSameDiagonally ? 'diagonal' : 'vertAndLateral';
  const squaresAlongVector = allSquares.filter(
    (s) =>
      moves[matchingVector](squareOne)(s) && moves[matchingVector](squareTwo)(s)
  );

  return squaresAlongVector;
};

/* sort moves */

const sortMovesClosestTo =
  (square: Square) =>
  (moves: Moves): Moves => {
    return [...moves].sort((a, b) => {
      const { xDiff: x1Diff, yDiff: y1Diff } = calcDistance(square)(a);
      const aDiff = Math.abs(x1Diff) + Math.abs(y1Diff);

      const { xDiff: x2Diff, yDiff: y2Diff } = calcDistance(square)(b);
      const bDiff = Math.abs(x2Diff) + Math.abs(y2Diff);

      return aDiff - bDiff;
    });
  };

/* get moves */

function getPossibleMoves(piece: Piece | Pawn, board: Board) {
  const allSquares = Array.from(board.keys());

  return allSquares.filter((s) => piece.isValidMove(s));
}

function getValidMoves(piece: Piece | Pawn, square: Square, board: Board) {
  const possibleMoves = getPossibleMoves(piece, board);
  const obstructions = possibleMoves.filter((s) => board.get(s)?.piece);
  if (!obstructions.length) {
    if (piece.type === 'pawn')
      return [...getPawnCaptures(piece, board), ...possibleMoves];
    return possibleMoves;
  }

  let unobstructedMoves: Moves = [];
  switch (piece.type) {
    case 'knight': {
      unobstructedMoves = possibleMoves;
      break;
    }
    case 'pawn': {
      const capturesAvailable = getPawnCaptures(piece, board);
      const unobstructedMoves = removeMovesWithPieces(
        removeObstructedMoves(square, possibleMoves, obstructions),
        board
      );
      return [...capturesAvailable, ...unobstructedMoves];
    }
    case 'king': {
      unobstructedMoves = removeProtectedSquares(piece, possibleMoves, board);
      break;
    }
    default: {
      unobstructedMoves = removeObstructedMoves(
        square,
        possibleMoves,
        obstructions
      );
    }
  }

  return removeMovesWithPieces(unobstructedMoves, board, piece.color);
}

function getMovesForAllPieces(color: Color, board: Board): Moves {
  const allMoves: Moves[] = [];
  for (const [square, { piece }] of board.entries()) {
    if (!piece) continue;
    if (piece.color !== color) continue;

    allMoves.push(getValidMoves(piece, square, board));
  }

  return allMoves.flat();
}

function getPawnCaptures(pawn: Pawn, board: Board) {
  const captureMoves = pawn.getCaptureSquares();
  return captureMoves.filter((s) => {
    const squareVal = board.get(s);
    if (!squareVal) return false;

    const piece = squareVal.piece;
    const enPassant = squareVal.enPassant;

    return (
      (piece && piece.color !== pawn.color) ||
      (enPassant && enPassant !== pawn.color)
    );
  });
}

function getSquaresBetweenKingAndCheck(
  kingPosition: Square,
  checkPosition: Square,
  allSquares: Moves
) {
  const squaresAlongVector = getMovesAlongVector(
    kingPosition,
    checkPosition,
    allSquares
  );
  const squaresBetweenKingAndPiece = removeMovesBehindTwoSquares(
    kingPosition,
    checkPosition,
    squaresAlongVector
  );
  return squaresBetweenKingAndPiece;
}

/* filter moves */

function removeMovesBehindTwoSquares(
  squareOne: Square,
  squareTwo: Square,
  vector: Moves
): Moves {
  const sorted = sortMovesClosestTo(getBeginningOfVector(vector))(vector);
  let furthestSquare;
  let closestSquare;

  if (sorted.indexOf(squareOne) > sorted.indexOf(squareTwo)) {
    furthestSquare = squareOne;
    closestSquare = squareTwo;
  } else {
    furthestSquare = squareTwo;
    closestSquare = squareOne;
  }
  const removedOneEnd = removeMovesBehindSquare(furthestSquare)(sorted);
  const removedBothEnds = removeMovesBehindSquare(closestSquare)(
    removedOneEnd.reverse()
  );

  return removedBothEnds;
}

const removeMovesBehindSquare =
  (square: Square) =>
  (moves: Moves): Moves => {
    const copy = [...moves];
    const index = moves.indexOf(square);

    if (index === -1) return [];

    copy.splice(index + 1);

    return copy;
  };

function removeObstructedMoves(
  startingSquare: Square,
  possibleMoves: Moves,
  obstructions: Moves
): Moves {
  // a) split possible moves into vectors (up,down,left,right, and/or diagonals)
  // b) see which obstructions belong to which vector
  // c) find the closest obstruction
  // d) remove all the moves behind that obstruction

  const filteredMoves: Moves[] = [];

  const allVectors = splitIntoVectors(possibleMoves, startingSquare);
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

function removeProtectedSquares(
  king: Piece,
  possibleMoves: Moves,
  board: Board
): Moves {
  // a) for each piece inside king's move radius, check if it is opposite color
  // b) for each piece of opposite color inside the move radius, replace with King (need to do this to find if pawn protects a piece)
  // c) check board for any piece that has that square in it's moveset

  // a)
  const oppColor = king.color === 'white' ? 'black' : 'white';
  const enemyPiecesSquares = possibleMoves.filter((s) => {
    const squareVal = board.get(s);
    if (!squareVal) return false;
    const piece = squareVal.piece;
    if (!piece) return false;

    return piece.color === oppColor;
  });

  // b)
  const boardCopy = new Map(board);
  enemyPiecesSquares.forEach((s) => {
    boardCopy.set(s, { piece: king });
  });

  // c)
  const allEnemyMoves = getMovesForAllPieces(oppColor, boardCopy);
  return possibleMoves.filter((s) => {
    // get squares such that no enemy pieces can capture there
    return !allEnemyMoves.includes(s);
  });
}

function removeMovesWithPieces(
  moves: Moves,
  board: Board,
  color?: Color
): Moves {
  return moves.filter((s) => {
    const squareVal = board.get(s);
    if (!squareVal) return false;

    if (color) return !squareVal.piece || squareVal.piece.color !== color;
    else return !squareVal.piece;
  });
}

/* gameboard checks */

function isDiscoveredCheck(
  kingPosition: Square,
  kingColor: Color,
  openSquare: Square,
  board: Board
): string {
  let squaresAlongVector = getMovesAlongVector(
    kingPosition,
    openSquare,
    Array.from(board.keys())
  );
  squaresAlongVector = squaresAlongVector.filter(
    (s) => s !== kingPosition && s !== openSquare
  );
  if (!squaresAlongVector.length) return '';

  for (const square of squaresAlongVector) {
    const piece = board.get(square)?.piece;
    if (!piece || piece.color === kingColor) continue;

    const validMoves = getValidMoves(piece, square, board);
    if (validMoves.includes(kingPosition)) return square;
  }

  return '';
}

function canBlockOrCaptureCheck(
  king: Piece,
  pieceGivingCheck: Piece | Pawn,
  board: Board
) {
  let squaresToCheckFor: Square | Moves;
  switch (pieceGivingCheck.type) {
    case 'knight': {
      squaresToCheckFor = pieceGivingCheck.current;
      break;
    }
    default: {
      squaresToCheckFor = getSquaresBetweenKingAndCheck(
        king.current,
        pieceGivingCheck.current,
        Array.from(board.keys())
      );
    }
  }

  const ownPieceMoves = getMovesForAllPieces(king.color, board);
  return ownPieceMoves.some((move) => squaresToCheckFor.includes(move));
}

function shouldToggleEnPassant(start: Square, end: Square) {
  const { y: y1 } = toXY(start);
  const { y: y2 } = toXY(end);

  return Math.abs(y1 - y2) === 2;
}

export {
  getValidMoves,
  isDiscoveredCheck,
  canBlockOrCaptureCheck,
  shouldToggleEnPassant
};
