import {
  getLegalMoves,
  getDiscoveredCheck,
  canBlockOrCaptureCheck,
  getAttackingMovesForColor,
  getAllMovesForColor,
  getLegalMovesInCheck
} from './utils/moves';
import { toXY, fromXY, parseNotation, isLightSquare } from './utils/helpers';
import { ranks, files } from './ranksAndFiles';
import {
  Color,
  Square,
  Board,
  PieceType,
  Moves,
  CastleSquaresType,
  HistoryType
} from './types/types';
import {
  AllPieceMap,
  BoardStateInterface,
  CastleObj,
  EnPassantObj,
  GameboardObj,
  MoveDetailsInterface,
  PieceMap,
  PieceObj
} from './types/interfaces';
import Castle from './Castle';
import { startingPositions } from './main';
import moveNotation from './moveNotation';
import Piece from './Piece';
import { compareObjects, compare1dArrayNoOrder } from './utils/compare';

function createBoard(): Board {
  return files.reduce((acc, file) => {
    ranks.forEach((rank) => {
      const square = file.concat(rank.toString());
      acc.set(square, { piece: null });
    });
    return acc;
  }, new Map());
}

const Gameboard = (
  board = createBoard(),
  squaresGivingCheck = [] as Moves,
  CastleRights?: CastleObj
): GameboardObj => {
  board = new Map(board);

  function placePieces(pieceMap: AllPieceMap, boardMap = board) {
    let color: keyof typeof pieceMap;
    for (color in pieceMap) {
      const map = pieceMap[color];

      let pieceType: keyof typeof map;
      for (pieceType in map) {
        const squares = map[pieceType];
        squares.forEach((s) =>
          at(s, boardMap).place({ type: pieceType, color: color })
        );
      }
    }
  }

  function makeMove(
    s1: Square,
    s2: Square,
    promote?: PieceType
  ): Board | undefined {
    const piece = at(s1).piece;

    // validate move
    if (!piece) return;
    if (!validate.move(s1, s2)) return;
    if (promote && !validate.promotion(s1, s2)) return;

    switch (piece.type) {
      case 'pawn': {
        if (promote) {
          at(s1).promote(promote);
        }

        if (enPassant.isCapture(s1, s2)) {
          enPassant.capture(s2);
        }

        enPassant.remove();
        if (enPassant.checkToggle(s1, s2)) {
          enPassant.toggle(piece.color, s2);
        }

        from(s1).to(s2);
        break;
      }

      case 'king': {
        // check if move is castle
        const castleSide = get.castleSide(piece.color, s2);
        if (castleSide) castle(piece.color, castleSide);
        else from(s1).to(s2);

        enPassant.remove();

        break;
      }

      default:
        from(s1).to(s2);
        enPassant.remove();
    }

    return board;
  }

  function castle(
    color: Color,
    side: 'kingside' | 'queenside',
    boardMap = board
  ): void {
    const castleSquares = get.castleSquares(color)[side];

    const kingPos = get.kingPosition(color, boardMap) as Square;
    const rookPos = getRookPos() as Square;

    from(rookPos, boardMap).to(castleSquares[0]);
    from(kingPos, boardMap).to(castleSquares[1]);

    function getRookPos() {
      const pieceMap = get.pieceMap(boardMap);
      const rookPos = pieceMap[color].rook.find((square) => {
        const file = square.split('')[0];
        return side === 'kingside'
          ? files.indexOf(file) > 3
          : files.indexOf(file) < 3;
      });

      return rookPos;
    }
    // need to get king position
    // need to get castle squares
    // need to find rook
  }

  const enPassant = (() => {
    return {
      getSquare: (current: Square, color: Color): Square => {
        const { x, y } = toXY(current);
        const newY = color === 'white' ? y - 1 : y + 1;
        return fromXY({ x, y: newY });
      },
      checkToggle: (from: Square, to: Square): boolean => {
        const { y: y1 } = toXY(from);
        const { y: y2 } = toXY(to);

        return Math.abs(y1 - y2) === 2;
      },
      toggle: (color: Color, current: Square, boardMap = board): Square => {
        const enPassantSquare = enPassant.getSquare(current, color);
        at(enPassantSquare, boardMap).setEnPassant(color, current);
        return enPassantSquare;
      },
      remove: (boardMap = board): void => {
        for (const squareObj of boardMap.values()) {
          if (squareObj.enPassant) return (squareObj.enPassant = undefined);
        }
      },
      isCapture: (from: Square, to: Square, boardMap = board): boolean => {
        const piece = at(from, boardMap).piece;
        const enPassant = boardMap.get(to)?.enPassant;
        if (!piece || piece.type !== 'pawn') return false;
        if (!enPassant) return false;
        if (enPassant.color === piece.color) return false;
        return true;
      },
      capture: (to: Square, boardMap = board) => {
        const enPassant = boardMap.get(to)?.enPassant as EnPassantObj;

        at(enPassant.current, boardMap).remove();
      }
    };
  })();

  const isDraw = {
    byRepetition: (
      boardStates: BoardStateInterface[],
      newBoardState: BoardStateInterface
    ) => {
      const repeated = boardStates.filter((bs) => {
        return compareObjects(bs, newBoardState);
      }).length;

      return {
        threefold: repeated >= 2,
        fivefold: repeated === 4
      };
    },
    byMoveRule: (history: HistoryType) => {
      const flat = history.flat();

      const lastPawnMoveOrCaptureIdx =
        flat.length -
        1 -
        [...flat].reverse().findIndex((m) => {
          return m[0].toLowerCase() === m[0] || m.includes('x');
        });

      const movesSinceLastPawnMoveOrCapture = flat.slice(
        lastPawnMoveOrCaptureIdx
      ).length;

      return {
        fifty: movesSinceLastPawnMoveOrCapture >= 100,
        seventyfive: movesSinceLastPawnMoveOrCapture >= 150
      };
    },
    byStalemate: (turn: Color, boardMap = board) => {
      const oppColor = turn === 'white' ? 'black' : 'white';

      if (
        !squaresGivingCheck.length &&
        !getAllMovesForColor(oppColor, boardMap).length
      )
        return true;
      else return false;
    },
    byInsufficientMaterial: (pieceMap = get.pieceMap()) => {
      const piecesLeft = {
        white: Object.keys(pieceMap.white) as PieceType[],
        black: Object.keys(pieceMap.black) as PieceType[]
      };

      const insufficientMaterial = new Map();
      insufficientMaterial.set(['king'].toString(), [
        ['king'],
        ['king', 'bishop'],
        ['king', 'knight']
      ]);
      insufficientMaterial.set(['king', 'bishop'].toString(), [
        ['king', 'bishop']
      ]);
      insufficientMaterial.set(['bishop', 'king'].toString(), [
        ['king', 'bishop']
      ]);

      let color: keyof typeof pieceMap;
      // if there's more than one of each piece, there's no draw
      for (color in piecesLeft) {
        for (const pieceType of piecesLeft[color]) {
          if (pieceMap[color][pieceType].length !== 1) return false;
        }
      }

      for (color in pieceMap) {
        const oppColor = color === 'white' ? 'black' : 'white';

        const drawPossibilities: PieceType[][] | undefined =
          insufficientMaterial.get(piecesLeft[color].toString());
        if (!drawPossibilities) continue;

        // piecesLeft of oppColor has to match one of the draw possibilities
        const drawImminent = drawPossibilities.some((a) => {
          if (!compare1dArrayNoOrder(a, piecesLeft[oppColor])) return false;

          if (piecesLeft[color].includes('bishop')) {
            return (
              isLightSquare(pieceMap[color].bishop[0]) ===
              isLightSquare(pieceMap[oppColor].bishop[0])
            );
          }

          return true;
        });

        if (drawImminent) return true;
      }

      return false;
    }
  };

  const at = (square: Square, boardMap = board) => ({
    place: (piece: PieceObj): void => {
      if (!boardMap.get(square)) return;

      boardMap.set(square, { piece });
    },
    remove: (): void => {
      if (!boardMap.get(square)) return;

      boardMap.set(square, { piece: null });
    },
    promote: (pieceType: PieceType): void => {
      const squareVal = boardMap.get(square);
      const piece = squareVal?.piece;
      if (!piece) return;

      boardMap.set(square, {
        ...squareVal,
        piece: { ...piece, type: pieceType }
      });
    },
    setEnPassant: (color: Color, current: Square): void => {
      if (!boardMap.get(square)) return;

      boardMap.set(square, {
        piece: null,
        enPassant: {
          current /* square pawn is on */,
          color
        }
      });
    },
    get piece() {
      return boardMap.get(square)?.piece;
    },
    getLegalMoves: (checks = squaresGivingCheck || []): Moves => {
      const { type, color } = at(square, boardMap).piece as PieceObj;

      switch (checks.length) {
        case 2: {
          if (type !== 'king') return [];
          return getLegalMoves(square, boardMap);
        }
        case 1: {
          if (type === 'king') return getLegalMoves(square, boardMap);
          else
            return getLegalMovesInCheck(
              square,
              boardMap,
              get.kingPosition(color) as Square,
              checks[0]
            );
        }
        default: {
          if (type === 'king') {
            let legalMoves = getLegalMoves(square, boardMap);
            if (get.canCastle(color, 'kingside'))
              legalMoves = [
                ...legalMoves,
                ...get.castleSquares(color).kingside
              ];
            if (get.canCastle(color, 'queenside'))
              legalMoves = [
                ...legalMoves,
                ...get.castleSquares(color).queenside
              ];

            return legalMoves;
          } else return getLegalMoves(square, boardMap);
        }
      }
    }
  });

  const from = (s1: Square, boardMap = board) => ({
    to: (s2: Square): void => {
      const piece = at(s1, boardMap).piece;
      if (!piece) return;

      // move piece
      at(s1, boardMap).remove();
      at(s2, boardMap).place(piece);
    }
  });

  const get = {
    kingPosition: (color: Color, boardMap = board): Square | undefined => {
      for (const [square, value] of boardMap.entries()) {
        if (
          value.piece &&
          value.piece.type === 'king' &&
          value.piece.color === color
        )
          return square;
      }
    },
    pieceMap: (boardMap = board): AllPieceMap => {
      const pieceMap = {
        white: {} as PieceMap,
        black: {} as PieceMap
      };
      for (const [square, value] of boardMap.entries()) {
        const { piece } = value;
        if (!piece) continue;

        const { type, color } = piece;
        if (pieceMap[color][type]) pieceMap[color][type].push(square);
        else pieceMap[color][type] = [square];
      }
      return pieceMap;
    },
    piecesThatHitSquare: (
      color: Color,
      pieceType: PieceType,
      square: Square,
      boardMap = board
    ): Square[] => {
      const pieceMap = get.pieceMap(boardMap);
      if (pieceMap[color][pieceType].includes(square)) return [];

      const pieces: Square[] = [];
      if (pieceMap[color][pieceType].length <= 1) return [];
      pieceMap[color][pieceType].forEach((s) => {
        if (at(s, boardMap).getLegalMoves().includes(square)) pieces.push(s);
      });
      return pieces;
    },
    squaresGivingCheckAfterMove: (from: Square, end: Square): Square[] => {
      const squaresGivingCheck: string[] = [];

      const piece = board.get(end)?.piece as PieceObj;
      const oppColor = piece.color === 'white' ? 'black' : 'white';
      const kingPosition = get.kingPosition(oppColor) as Square;

      const pieceHitsKing = getLegalMoves(end, board).includes(kingPosition);
      if (pieceHitsKing) squaresGivingCheck.push(end);

      const discoveredCheck = getDiscoveredCheck(
        kingPosition,
        oppColor,
        from,
        board
      );
      if (discoveredCheck && discoveredCheck !== end)
        squaresGivingCheck.push(discoveredCheck);

      return squaresGivingCheck;
    },
    isCheckmate: (
      colorOfKing: Color,
      squaresGivingCheck: string[],
      boardMap = board
    ): boolean => {
      const kingPos = get.kingPosition(colorOfKing, boardMap) as Square;
      const legalMoves = at(kingPos, boardMap).getLegalMoves();
      // check if check can be blocked
      if (squaresGivingCheck.length === 1) {
        if (canBlockOrCaptureCheck(kingPos, squaresGivingCheck[0], boardMap))
          return false;
      }
      if (legalMoves.length) return false;
      return true;
    },
    castleSquares(color: Color): CastleSquaresType {
      const rank = color === 'white' ? 1 : 8;
      return {
        kingside: [`f${rank}`, `g${rank}`],
        queenside: [`d${rank}`, `c${rank}`]
      };
    },
    castleSide(color: Color, to: Square): '' | 'queenside' | 'kingside' {
      let castleSide: '' | 'queenside' | 'kingside' = '';
      const castleSquares = get.castleSquares(color);

      for (const [side, squares] of Object.entries(castleSquares)) {
        if (squares[1] === to) castleSide = side as 'kingside' | 'queenside';
      }
      return castleSide;
    },
    castleRightsAfterMove: (
      square: Square,
      boardMap = board,
      castleRights = CastleRights || Castle(true, true, true, true)
    ): CastleObj => {
      const piece = at(square, boardMap).piece as PieceObj;

      castleRights = {
        white: { ...castleRights.white },
        black: { ...castleRights.black }
      };

      if (
        castleRights[piece.color].kingside ||
        castleRights[piece.color].queenside
      ) {
        // check if i need to change castling rights
        if (piece.type === 'king') {
          castleRights[piece.color].kingside = false;
          castleRights[piece.color].queenside = false;
        }

        if (piece.type === 'rook') {
          // need to find if it is kingside or queenside rook
          const [file] = square.split('');
          const kingside = files.indexOf(file) > 3;
          if (kingside) castleRights[piece.color].kingside = false;
          else castleRights[piece.color].queenside = false;
        }
      }

      return castleRights;
    },
    canCastle: (
      color: Color,
      side: 'kingside' | 'queenside',
      boardMap = board
    ): boolean => {
      if (CastleRights && !CastleRights[color][side]) return false;

      // check if rook still exists
      if (!checkIfRookExists()) return false;

      const oppColor = color === 'white' ? 'black' : 'white';
      const oppMoves = getAttackingMovesForColor(oppColor, boardMap);

      const castleSquares = get.castleSquares(color)[side];
      for (const square of castleSquares) {
        // check if castle square is cleared
        if (at(square, boardMap).piece) return false;
        // make sure castle square isnt attacked
        if (oppMoves.includes(square)) return false;
      }

      return true;

      function checkIfRookExists(): boolean {
        let rookExists = false;
        const rank = color === 'white' ? 1 : 8;
        const loopStart =
          side === 'queenside' ? files.indexOf('a') : files.indexOf('d');
        const loopEnd =
          side === 'queenside' ? files.indexOf('e') : files.indexOf('h');
        for (let i = loopStart; i <= loopEnd; i++) {
          const square = files[i] + rank;

          const piece = at(square, boardMap).piece;
          if (!piece) continue;

          if (piece.type === 'rook') rookExists = true;
        }
        return rookExists;
      }
    },
    boardStatesFromHistory: (history: HistoryType): BoardStateInterface[] => {
      const boardStates: BoardStateInterface[] = [];
      let castleRights = Castle(true, true, true, true);

      const boardMap = createBoard();
      placePieces(startingPositions.standard, boardMap);
      let pieceMap = startingPositions.standard;

      // history is 2d array
      const flat = history.flat();

      /* iterate over history */
      for (const [i, m] of flat.entries()) {
        const parsed = parseNotation(m);
        const color = i % 2 === 0 ? 'white' : 'black';

        if (parsed.castle) {
          castle(color, parsed.castle, boardMap);

          castleRights = {
            white: { ...castleRights.white },
            black: { ...castleRights.black }
          };
          castleRights[color].kingside = false;
          castleRights[color].queenside = false;

          pieceMap = get.pieceMap(boardMap);
          boardStates.push({ pieceMap, castleRights });
          continue;
        }

        const possiblePieces = pieceMap[color][parsed.pieceType].filter((s) =>
          getLegalMoves(s, boardMap).includes(parsed.to)
        );

        // get 'from' square
        let s1: Square;
        if (parsed.from) {
          const notation = parsed.from;
          if (notation.length === 2) s1 = notation;
          else {
            s1 =
              possiblePieces.find((s) => {
                // if notation is a number, that means piece is on the rank === notation, if not, same file
                return isNaN(Number(notation))
                  ? s[0] === notation
                  : s[1] === notation;
              }) || '';
          }
        } else s1 = possiblePieces[0];

        const piece = at(s1, boardMap).piece;
        if (!s1 || !piece) {
          break;
        }

        let enPassantSquare = '';
        // make move
        if (piece.type === 'pawn') {
          if (enPassant.isCapture(s1, parsed.to, boardMap)) {
            enPassant.capture(parsed.to, boardMap);
          }

          enPassant.remove(boardMap);

          if (enPassant.checkToggle(s1, parsed.to))
            enPassantSquare = enPassant.toggle(color, parsed.to, boardMap);

          if (parsed.promote) {
            at(s1, boardMap).promote(parsed.promote);
          }
        } else enPassant.remove(boardMap);

        from(s1, boardMap).to(parsed.to);
        castleRights = get.castleRightsAfterMove(
          parsed.to,
          boardMap,
          castleRights
        );
        pieceMap = get.pieceMap(boardMap);
        boardStates.push({
          pieceMap,
          castleRights,
          enPassant: boardMap.get(enPassantSquare)?.enPassant
        });
      }

      return boardStates;
    },
    moveNotation(
      from: Square,
      to: Square,
      promote?: PieceType,
      check?: boolean,
      checkmate?: boolean,
      boardMap = board
    ): string {
      const moveDetails: MoveDetailsInterface = {};

      const { type, color } = at(from, boardMap).piece as PieceObj;
      moveDetails.pieceType = type;

      if (checkmate) moveDetails.checkmate = checkmate;
      else if (check) moveDetails.check = check;

      let capture = false;
      switch (type) {
        case 'pawn': {
          capture = Piece(color, type)
            .getPawnCaptures(from)
            ?.includes(to) as boolean;
          moveDetails.capture = capture;
          if (capture) moveDetails.differentiation = from[0];
          break;
        }
        default: {
          capture = !!at(to, boardMap).piece;
          moveDetails.capture = capture;
        }
      }

      if (promote) moveDetails.promote = promote;

      // get differentiation ie. when multiple pieces hit the same square
      const piecesThatHitSquare = get.piecesThatHitSquare(
        color,
        type,
        to,
        boardMap
      );
      switch (piecesThatHitSquare.length) {
        case 3:
          moveDetails.differentiation = from;
          break;
        case 2: {
          // need to find if on same file or rank
          const otherPiece = piecesThatHitSquare.find(
            (s) => s !== from
          ) as Square;
          moveDetails.differentiation =
            otherPiece[0] === from[0] ? from[1] : from[0];
        }
      }

      return moveNotation(to).get(moveDetails);
    }
  };

  const validate = {
    move: (from: Square, to: Square, boardMap = board): boolean => {
      const piece = at(from, boardMap).piece;
      if (!piece) return false;

      if (!at(from, boardMap).getLegalMoves().includes(to)) return false;

      return true;
    },
    promotion: (from: Square, to: Square, boardMap = board): boolean => {
      const piece = at(from, boardMap).piece;

      if (piece?.type !== 'pawn') return false;

      const endOfBoard = piece.color === 'white' ? 8 : 1;
      const [, rank] = to.split('');
      if (+rank !== endOfBoard) return false;

      return true;
    }
  };

  return {
    createBoard,
    placePieces,
    castle,
    isDraw,
    enPassant,
    at,
    from,
    get,
    validate,
    makeMove,
    get board() {
      return board;
    }
  };
};

export default Gameboard;
