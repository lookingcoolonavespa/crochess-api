import { calcDistance, toXY } from './helpers';
import {
  PieceInterface,
  SquareObj,
  PieceObj,
  EnPassantObj
} from '../types/interfaces';
import { Moves, Board, Square, Color } from '../types/types';
import Piece from '../Piece';

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

function splitIntoVectors(arrayOfMoves: Moves, start: Square) {
  interface Vectors {
    [key: string]: string[];
  }
  return arrayOfMoves.reduce((acc: Vectors, curr: Square) => {
    const { xDiff, yDiff } = calcDistance(start)(curr);

    let vector = '';
    if (yDiff !== 0) vector = yDiff < 0 ? 'up' : 'down';
    if (xDiff !== 0) vector += xDiff < 0 ? 'Right' : 'Left';

    // normalize vector name
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
  s1: Square,
  s2: Square,
  allSquares: Moves
): Moves => {
  const liesSameVertOrLat = moves.vertAndLateral(s1)(s2);
  const liesSameDiagonally = moves.diagonal(s1)(s2);

  const liesOnSameLine = liesSameVertOrLat || liesSameDiagonally;
  if (!liesOnSameLine) return [];

  const matchingVector = liesSameDiagonally ? 'diagonal' : 'vertAndLateral';

  const squaresAlongVector = allSquares.filter(
    (s) => moves[matchingVector](s1)(s) && moves[matchingVector](s2)(s)
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

function getPossibleMoves(origin: Square, board: Board) {
  // get all moves that can happen if no other pieces were on the board
  const allSquares = Array.from(board.keys());

  const square = board.get(origin) as SquareObj;

  const { type, color } = square.piece as PieceObj;
  const piece = Piece(color, type);

  return allSquares.filter((s) => piece.hasMove(origin, s));
}

function getLegalMoves(origin: Square, board: Board) {
  // get moves of piece that is on origin

  const square = board.get(origin) as SquareObj;

  const { type, color } = square.piece as PieceObj;
  const piece = Piece(color, type);

  const possibleMoves = getPossibleMoves(origin, board);

  const obstructions = possibleMoves.filter((s) => board.get(s)?.piece);
  if (!obstructions.length) {
    if (type === 'pawn')
      return [...getPawnCaptures(origin, board), ...possibleMoves];
    return possibleMoves;
  }

  let legalMoves: Moves = [];
  switch (type) {
    case 'knight': {
      legalMoves = possibleMoves;
      break;
    }
    case 'pawn': {
      const capturesAvailable = getPawnCaptures(origin, board);
      const unobstructedMoves = removeMovesWithPieces(
        removeObstructedMoves(origin, possibleMoves, obstructions),
        board
      );
      legalMoves = [...capturesAvailable, ...unobstructedMoves];
      break;
    }
    case 'king': {
      legalMoves = removeProtectedSquares(piece, possibleMoves, board);
      break;
    }
    default: {
      legalMoves = removeObstructedMoves(origin, possibleMoves, obstructions);
    }
  }

  return removeMovesWithPieces(legalMoves, board, piece.color);
}

function getAllMovesForColor(color: Color, board: Board): Moves {
  const allMoves: Moves[] = [];
  for (const [square, { piece }] of board.entries()) {
    if (!piece) continue;
    if (piece.color !== color) continue;

    allMoves.push(getLegalMoves(square, board));
  }

  return allMoves.flat();
}

function getPawnCaptures(pawnSquare: Square, board: Board) {
  const { color } = board.get(pawnSquare)?.piece as PieceObj;
  const pawn = Piece(color, 'pawn');

  const captureMoves = pawn.getPawnCaptures(pawnSquare);
  if (!captureMoves) return [];

  return captureMoves.filter((s) => {
    const squareVal = board.get(s);
    if (!squareVal) return false;

    const piece = squareVal.piece;
    const enPassant: EnPassantObj | undefined = squareVal.enPassant;

    return (
      (piece && piece.color !== pawn.color) ||
      (enPassant && enPassant.color !== pawn.color)
    );
  });
}

function getSquaresBetweenKingAndCheck(
  kingPos: Square,
  checkPos: Square,
  allSquares: Moves
) {
  const squaresAlongVector = getMovesAlongVector(kingPos, checkPos, allSquares);
  const squaresBetweenKingAndPiece = removeMovesBehindTwoSquares(
    kingPos,
    checkPos,
    squaresAlongVector
  );
  return squaresBetweenKingAndPiece;
}

/* filter moves */

function removeMovesBehindTwoSquares(
  s1: Square,
  s2: Square,
  vector: Moves
): Moves {
  const sorted = sortMovesClosestTo(getBeginningOfVector(vector))(vector);
  let furthestSquare;
  let closestSquare;

  if (sorted.indexOf(s1) > sorted.indexOf(s2)) {
    furthestSquare = s1;
    closestSquare = s2;
  } else {
    furthestSquare = s2;
    closestSquare = s1;
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
      // look for vector obstruction is on
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
  king: PieceInterface,
  possibleMoves: Moves,
  board: Board
): Moves {
  // a) for each piece inside king's move radius, check if it is opposite color
  // b) for each piece of opposite color inside the move radius, replace with King (need to do this to find if pawn protects a piece bc getLegalMoves only checks pawn capture squares if there is an opp piece on those squares)
  // c) check board for any piece that has that square in it's move set

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
  const allEnemyMoves = getAllMovesForColor(oppColor, boardCopy);
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

function getDiscoveredCheck(
  kingPos: Square,
  kingColor: Color,
  vacated: Square,
  board: Board
): Square {
  // openSquare is a square just vacated
  let squaresAlongVector = getMovesAlongVector(
    kingPos,
    vacated,
    Array.from(board.keys())
  );
  squaresAlongVector = squaresAlongVector.filter(
    (s) => s !== kingPos && s !== vacated
  );
  if (!squaresAlongVector.length) return '';

  for (const square of squaresAlongVector) {
    const piece = board.get(square)?.piece;
    if (!piece || piece.color === kingColor) continue;

    const legalMoves = getLegalMoves(square, board);
    if (legalMoves.includes(kingPos)) return square;
  }

  return '';
}

function canBlockOrCaptureCheck(
  kingPos: Square,
  squareGivingCheck: Square,
  board: Board
): boolean {
  const king = board.get(kingPos)?.piece as PieceObj;
  const piece = board.get(squareGivingCheck)?.piece as PieceObj;

  let blockOrCaptureSquares: Square | Moves;
  switch (piece.type) {
    case 'knight': {
      blockOrCaptureSquares = squareGivingCheck;
      break;
    }
    default: {
      blockOrCaptureSquares = getSquaresBetweenKingAndCheck(
        kingPos,
        squareGivingCheck,
        Array.from(board.keys())
      );
    }
  }

  const ownPieceMoves = getAllMovesForColor(king.color, board);
  return ownPieceMoves.some((move) => blockOrCaptureSquares.includes(move));
}

export {
  getAllMovesForColor,
  getLegalMoves,
  getDiscoveredCheck,
  canBlockOrCaptureCheck
};
