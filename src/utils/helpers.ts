import { files, ranks } from 'crochess-api';
import {
  AllPieceMap,
  Coord,
  ParsedNotationInterface
} from '../types/interfaces';
import { PieceAbbreviation, Square } from '../types/types';

export function toXY(square: Square): Coord {
  const [x, y] = square.split('');
  return {
    x: files.indexOf(x.toLowerCase()),
    y: Number(y)
  };
}

export function fromXY(coord: Coord): Square {
  const { x, y } = coord;
  const col = files[x];
  if (!col) return '';
  return col.concat(y.toString());
}

export const calcDistance = (squareOne: string) => (squareTwo: string) => {
  const { x: x1, y: y1 } = toXY(squareOne);
  const { x: x2, y: y2 } = toXY(squareTwo);

  const xDiff = x1 - x2;
  const yDiff = y1 - y2;
  return {
    xDiff,
    yDiff
  };
};

export function getPieceFromAbbr(abbr: PieceAbbreviation) {
  switch (abbr) {
    case 'K':
      return 'king';

    case 'Q':
      return 'queen';

    case 'N':
      return 'knight';

    case 'B':
      return 'bishop';

    case 'R':
      return 'rook';
  }
}

export function parseNotation(notation: string) {
  const move = <ParsedNotationInterface>{};

  const replaced = notation.replace(/[+x#]/, '');

  if (+replaced[0] === 0) {
    // this is castle
    move.castle = replaced.length === 3 ? 'kingside' : 'queenside';
    return move;
  }

  if (replaced[0].toUpperCase() === replaced[0]) {
    // this is piece move
    move.pieceType = getPieceFromAbbr(replaced[0] as PieceAbbreviation);
    move.to = replaced.slice(-2);

    switch (replaced.length) {
      case 4:
        move.from = replaced[1];
        break;
      case 5:
        move.from = replaced.slice(1, 3);
        break;
    }

    return move;
  } else {
    // is a pawn move
    move.pieceType = 'pawn';

    if (replaced.includes('=')) {
      // indicates promotion
      move.promote = getPieceFromAbbr(replaced.slice(-1) as PieceAbbreviation);
    }

    const promoteNoteIndex = replaced.indexOf('=');
    const noPromoteNotation = replaced.slice(
      0,
      promoteNoteIndex === -1 ? replaced.length : promoteNoteIndex
    );
    if (noPromoteNotation.length === 3) {
      move.from = replaced[0];
    }
    move.to = noPromoteNotation.slice(-2);
  }

  return move;
}

export function deepCopy2dArray(arr: string[][]): string[][] {
  return arr.map((n) => [...n]);
}

export function comparePieceMaps(pm1: AllPieceMap, pm2: AllPieceMap) {
  let color: keyof typeof pm1;
  for (color in pm1) {
    const map = pm1[color];

    let pieceType: keyof typeof map;
    for (pieceType in map) {
      const squares = map[pieceType];
      const squares2 = pm2[color][pieceType];

      if (squares.length !== squares2.length) return false;

      for (let j = 0; j < squares.length; j++) {
        if (color === 'black' && pieceType === 'pawn')
          if (squares[j] !== squares2[j]) {
            return false;
          }
      }
    }
  }

  return true;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function compare1dArrayNoOrder(arr1: any[], arr2: any[]) {
  return arr1.length === arr2.length && arr1.every((v) => arr2.includes(v));
}

export function isLightSquare(square: Square) {
  const { x, y } = toXY(square);

  if ((x % 2 === 0 && y % 2 === 0) || (x % 2 !== 0 && y % 2 !== 0)) return true;
  else return false;
}
