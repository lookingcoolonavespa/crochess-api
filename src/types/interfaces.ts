import {
  Color,
  Square,
  Board,
  Moves,
  PieceType,
  CastleSquaresType,
  HistoryType
} from './types';

export interface Coord {
  x: number;
  y: number;
}

export interface xCoord {
  x: number;
}

export interface yCoord {
  y: number;
}

export interface PieceInterface {
  hasMove: (from: Square, to: Square) => boolean;
  getPawnCaptures: (origin: Square) => Square[] | undefined;
  readonly color: Color;
  readonly type: 'king' | 'queen' | 'knight' | 'bishop' | 'rook' | 'pawn';
}

export interface PieceObj {
  type: PieceType;
  color: Color;
}

export interface EnPassantObj {
  color: Color;
  current: Square;
}

export interface SquareObj {
  piece: PieceObj | null;
  enPassant?: EnPassantObj;
}

interface At {
  place: (piece: PieceInterface) => void;
  remove: () => void;
  piece: () => PieceInterface | null;
  getValidMoves: () => undefined | string[];
}

interface From {
  to: (endSquare: Square) => void;
}

interface Check {
  inCheckAfterMove: (startSquare: Square, endSquare: Square) => Moves;
  checkmate: (color: Color, squaresGivingCheck: string[]) => boolean;
}

export interface Gameboard {
  at: (square: Square) => At;
  from: (square: Square) => From;
  check: Check;
  board: Board;
  domBoard: Element;
}

export interface PieceMap {
  rook: Square[];
  bishop: Square[];
  knight: Square[];
  king: Square[];
  queen: Square[];
  pawn: Square[];
}

export interface AllPieceMap {
  white: PieceMap;
  black: PieceMap;
}

export interface GameboardObj {
  createBoard: () => Board;
  placePieces: (pieceMap: AllPieceMap, boardMap?: Board) => void;
  makeMove: (s1: Square, s2: Square, promote?: PieceType) => Board | undefined;
  castle: (color: Color, side: 'kingside' | 'queenside') => void;
  isDraw: {
    byRepetition: (
      boardStates: BoardStateInterface[],
      newBoardState: BoardStateInterface
    ) => { threefold: boolean; fivefold: boolean };
    byStalemate: (turn: Color, boardMap?: Board) => boolean;
    byInsufficientMaterial: (pieceMap: AllPieceMap) => boolean;
    byMoveRule: (history: HistoryType) => {
      fifty: boolean;
      seventyFive: boolean;
    };
  };
  enPassant: {
    getSquare: (current: Square, color: Color) => Square;
    checkToggle: (from: Square, to: Square) => boolean;
    toggle: (color: Color, current: Square) => Square;
    remove: () => void;
  };
  at: (square: Square) => {
    place: (piece: PieceObj) => void;
    remove: () => void;
    promote: (pieceType: PieceType) => void;
    setEnPassant: (color: Color, current: Square) => void;
    readonly piece: PieceObj | null | undefined;
    getLegalMoves: () => Moves;
  };
  from: (s1: Square) => {
    to: (s2: Square) => void;
  };
  get: {
    kingPosition: (color: Color) => Square | undefined;
    pieceMap: () => {
      white: PieceMap;
      black: PieceMap;
    };
    piecesThatHitSquare: (
      color: Color,
      pieceType: PieceType,
      square: Square,
      boardMap?: Board
    ) => Square[];
    squaresGivingCheckAfterMove: (from: Square, end: Square) => Square[];
    isCheckmate: (color: Color, squaresGivingCheck: string[]) => boolean;
    castleSquares: (color: Color) => CastleSquaresType;
    canCastle: (color: Color, side: 'kingside' | 'queenside') => boolean;
    castleRightsAfterMove: (square: Square) => CastleObj;
    boardStatesFromHistory: (history: HistoryType) => BoardStateInterface[];
    moveNotation: (
      from: Square,
      to: Square,
      promote?: PieceType,
      check?: boolean,
      checkmate?: boolean,
      boardMap?: Board
    ) => string;
  };
  validate: {
    move: (from: Square, to: Square) => boolean;
    promotion: (from: Square, to: Square) => boolean;
  };
  readonly board: Board;
}

export interface HistoryObj {
  insertMove: (notation: string) => HistoryType;
}

export interface CastleObj {
  white: {
    kingside: boolean;
    queenside: boolean;
  };
  black: {
    kingside: boolean;
    queenside: boolean;
  };
}

export interface ParsedNotationInterface {
  pieceType: PieceType;
  to: Square;
  from?: string;
  promote?: PieceType;
  castle?: 'kingside' | 'queenside';
}

export interface MoveDetailsInterface {
  capture?: boolean;
  castle?: 'kingside' | 'queenside';
  promote?: PieceType;
  check?: boolean;
  checkmate?: boolean;
  pieceType?: PieceType;
  differentiation?: string;
}

export interface BoardStateInterface {
  pieceMap: AllPieceMap;
  castleRights: CastleObj;
  enPassant?: EnPassantObj;
}
