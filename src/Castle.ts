import { CastleObj } from './types/interfaces';

export default function Castle(
  whiteKingside: boolean,
  whiteQueenside: boolean,
  blackKingside: boolean,
  blackQueenside: boolean
): CastleObj {
  return {
    white: {
      kingside: whiteKingside,
      queenside: whiteQueenside
    },
    black: {
      kingside: blackKingside,
      queenside: blackQueenside
    }
  };
}
