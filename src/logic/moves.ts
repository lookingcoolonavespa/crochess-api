import { calcDistance, toXY } from './helpers';
import {
  Coord,
  xCoord,
  yCoord,
  Piece,
  Pawn,
  SquareObj
} from '../types/interfaces';
import { Moves, Board, Square, Color } from '../types/types';

const moves = {
  vertAndLateral:
    ({ x: x1, y: y1 }: Coord) =>
    ({ x: x2, y: y2 }: Coord) =>
      x1 === x2 || y1 === y2,
  diagonal:
    ({ x: x1, y: y1 }: Coord) =>
    ({ x: x2, y: y2 }: Coord) =>
      Math.abs(x2 - x1) === Math.abs(y2 - y1),
  xByN:
    (num: number) =>
    ({ x: x1 }: xCoord) =>
    ({ x: x2 }: xCoord) =>
      Math.abs(x1 - x2) === num,
  yByN:
    (num: number) =>
    ({ y: y1 }: yCoord) =>
    ({ y: y2 }: yCoord) =>
      Math.abs(y1 - y2) === num
};

export default moves;

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

function getPossibleMoves(piece: Piece | Pawn, board: Board) {
  const allSquares = Array.from(board.keys());
  return allSquares.filter((s) => {
    if (piece.type === 'pawn') {
      const captureSquares = piece.getCaptureSquares();

      const capturesAvailable = captureSquares.filter((s) => {
        if (typeof s === 'undefined') return false;
        return (
          board.get(s)?.piece && board.get(s)?.piece?.color !== piece.color
        );
      });
      return piece.isValidMove(s, capturesAvailable);
    }
    return piece.isValidMove(s);
  });
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

function removeBlockedMoves(
  startingSquare: Square,
  possibleMoves: Moves,
  obstructions: Moves
): Moves {
  const filteredMoves = [];

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
  const enemyPiecesSquares = possibleMoves.filter(
    (s) => board.get(s)?.piece?.color !== king.color
  );

  // b)
  const boardCopy = new Map(board);
  enemyPiecesSquares.forEach((s) => {
    boardCopy.set(s, { piece: king });
  });

  // c)
  let allEnemyMoves: string[] = [];
  for (const [square, { piece }] of boardCopy.entries()) {
    if (enemyPiecesSquares.includes(square)) continue;
    if (!piece) continue;
    if (piece?.color === king.color) continue;

    allEnemyMoves = [
      ...allEnemyMoves,
      ...getValidMoves(piece, square, boardCopy)
    ];
  }
  return possibleMoves.filter((s) => {
    // get squares such that no enemy pieces can capture there
    return !allEnemyMoves.includes(s);
  });
}

function removeMovesWithOwnPieces(
  moves: Moves,
  board: Board,
  ownColor: Color
): Moves {
  return moves.filter((s) => {
    return !board.get(s)?.piece || board.get(s)?.piece?.color !== ownColor;
  });
}

function getValidMoves(piece: Piece | Pawn, square: Square, board: Board) {
  const possibleMoves = getPossibleMoves(piece, board);
  const obstructions = possibleMoves.filter((s) => board.get(s)?.piece);
  if (!obstructions.length) return possibleMoves;

  let unblockedMoves: Moves = [];
  switch (piece.type) {
    case 'knight': {
      unblockedMoves = possibleMoves;
      break;
    }
    case 'king': {
      unblockedMoves = removeProtectedSquares(piece, possibleMoves, board);
      break;
    }
    default: {
      unblockedMoves = removeBlockedMoves(square, possibleMoves, obstructions);
    }
  }

  return removeMovesWithOwnPieces(unblockedMoves, board, piece.color);
}

const getMovesAlongVector = (
  squareOne: Square,
  squareTwo: Square,
  allSquares: Moves
): Moves => {
  const liesSameVertOrLat = moves.vertAndLateral(toXY(squareOne))(
    toXY(squareTwo)
  );
  const liesSameDiagonally = moves.diagonal(toXY(squareOne))(toXY(squareTwo));
  const liesOnSameLine = liesSameVertOrLat || liesSameDiagonally;
  if (!liesOnSameLine) return [];

  const matchingVector = liesSameDiagonally ? 'diagonal' : 'vertAndLateral';
  const squaresAlongVector = allSquares.filter(
    (s) =>
      s !== squareOne &&
      s !== squareTwo &&
      moves[matchingVector](toXY(squareOne))(toXY(s)) &&
      moves[matchingVector](toXY(squareTwo))(toXY(s))
  );

  return squaresAlongVector;
};

function calcDiscoveredCheck(
  kingPosition: Square,
  openSquare: Square,
  board: Board
): string {
  const squaresAlongVector = getMovesAlongVector(
    kingPosition,
    openSquare,
    Array.from(board.keys())
  );

  if (!squaresAlongVector.length) return '';

  const kingColor = board.get(kingPosition)?.piece?.color;

  for (const square of squaresAlongVector) {
    const piece = board.get(square)?.piece;
    if (!piece || piece.color === kingColor) continue;
    const validMoves = getValidMoves(piece, square, board);
    if (validMoves.indexOf(kingPosition) !== -1) return square;
  }

  return '';
}

function calcBlockCheck(
  kingPosition: Square,
  checkPosition: Square,
  board: Board
) {
  const squareObj: SquareObj | undefined = board.get(kingPosition);
  if (!squareObj) return;
  const king: Piece | Pawn | null = squareObj.piece;
  if (!king) return;
  // if (board.get(kingPosition)?.piece.type !== 'king') return;
  const kingColor = king.color;

  const squaresBetweenKingAndPiece = getSquaresBetweenKingAndCheck(
    kingPosition,
    checkPosition,
    Array.from(board.keys())
  );
}

function getMovesForAllPieces(color: Color, board: Board) {
  for (const [square, { piece }] of board.entries()) {
    if (!piece) continue;
    if (piece.color !== color) continue;

    const pieceMoves = getValidMoves(piece, square, board);
  }
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

function removeMovesBehindTwoSquares(
  squareOne: Square,
  squareTwo: Square,
  moves: Moves
): Moves {
  const sorted = sortMovesClosestTo(getBeginningOfVector(moves))(moves);
  let furthestSquare;
  let closestSquare;

  if (sorted.indexOf(squareOne) > sorted.indexOf(squareTwo)) {
    furthestSquare = squareOne;
    closestSquare = squareTwo;
  } else {
    furthestSquare = squareTwo;
    closestSquare = squareOne;
  }
  const removedOneEnd =
    removeMovesBehindSquare(furthestSquare)(sorted).reverse();
  const removedBothEnds = removeMovesBehindSquare(closestSquare)(removedOneEnd);

  return removedBothEnds;
}

function getBeginningOfVector(vector: Moves) {
  return vector.reduce((acc, curr) => {
    const { x: x1, y: y1 } = toXY(acc);
    const { x: x2, y: y2 } = toXY(curr);

    const accIsBeginning = x1 === x2 ? y1 < y2 : x1 < x2;
    return accIsBeginning ? acc : curr;
  });
}

export { getValidMoves, calcDiscoveredCheck, calcBlockCheck };
