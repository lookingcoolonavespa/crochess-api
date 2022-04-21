import { MoveDetailsInterface } from './types/interfaces';
import { PieceType } from './types/types';

const moveNotation = (notation: string) => {
  function castle(side: 'kingside' | 'queenside') {
    notation = side === 'kingside' ? '0-0' : '0-0-0';
    return notation;
  }

  const affix = {
    pieceNotation: (pieceType: PieceType, differentiation?: string) => {
      differentiation = differentiation || '';

      switch (pieceType) {
        case 'pawn': {
          notation = differentiation + notation;
          return notation;
        }
        case 'king': {
          notation = 'K' + notation;
          return notation;
        }
        case 'knight': {
          notation = 'N' + differentiation + notation;
          return notation;
        }
        default: {
          notation = pieceType[0].toUpperCase() + differentiation + notation;
          return notation;
        }
      }
    },
    capture: () => {
      notation = `x${notation}`;
      return notation;
    },
    promote: (pieceType: PieceType) => {
      const suffix =
        '=' + pieceType === 'knight' ? 'N' : pieceType.charAt(0).toUpperCase();
      notation += '=' + suffix;
      return notation;
    },
    check: () => {
      notation += '+';
      return notation;
    },
    checkmate: () => {
      notation += '#';
      return notation;
    }
  };

  function get(moveDetails: MoveDetailsInterface) {
    const {
      capture,
      castle: castleSide,
      promote,
      check,
      checkmate,
      pieceType,
      differentiation
    } = moveDetails;

    if (castleSide) return castle(castleSide);

    if (capture) affix.capture();
    affix.pieceNotation(pieceType as PieceType, differentiation);
    if (promote) affix.promote(promote);
    if (check) affix.check();
    if (checkmate) affix.checkmate();

    return notation;
  }
  return {
    get
  };
};

export default moveNotation;
