import Gameboard from '../Gameboard';
import Bishop from '../pieces/Bishop';
import Knight from '../pieces/Knight';
import Rook from '../pieces/Rook';
import Pawn from '../pieces/Pawn';

test('gameboard is correct', () => {
  const gameboard = Gameboard();
  expect(Object.keys(gameboard.board).length).toBe(64);
});

test('gameboard places pieces correctly', () => {
  const gameboard = Gameboard();
  const rook = Rook();
  gameboard.at('a1').place(rook);
  expect(gameboard.at('a1').piece).toEqual(rook);
});

test('gameboard.at.place doesnt accept invalid squares', () => {
  const gameboard = Gameboard();
  const rook = Rook();
  expect(gameboard.at('a0').place(rook)).toBe('square does not exist');
});

test('gameboard moves pieces correctly', () => {
  const gameboard = Gameboard();
  const rook = Rook();
  gameboard.at('a1').place(rook);
  gameboard.from('a1').to('a2');
  expect(gameboard.at('a2').piece).toEqual(rook);
  expect(gameboard.at('a1').piece).toBe(null);
});

describe('isValidMove works correctly for each piece', () => {
  test('rook', () => {
    const gameboard = Gameboard();
    const piece = Rook();
    gameboard.at('a1').place(piece);
    expect(piece.isValidMove('a2')).toBe(true);
    expect(piece.isValidMove('b2')).toBe(false);
  });
  test('pawn', () => {
    const gameboard = Gameboard();
    const piece = Pawn('white');
    gameboard.at('e2').place(piece);
    expect(piece.isValidMove('e3')).toBe(true);
    expect(piece.isValidMove('e4')).toBe(true);
    expect(piece.isValidMove('b2')).toBe(false);
  });
});

describe('testing getAllValidMoves for Rook', () => {
  test('no obstructions', () => {
    const gameboard = Gameboard();
    const rook = Rook();
    gameboard.at('a1').place(rook);

    const allValidMoves = gameboard.at('a1').getAllValidMoves();
    const expected = [
      'a2',
      'a3',
      'a4',
      'a5',
      'a6',
      'a7',
      'a8',
      'b1',
      'c1',
      'd1',
      'e1',
      'f1',
      'g1',
      'h1',
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is in front of piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook('white');
    const secondRook = Rook('white');
    gameboard.at('a1').place(rook);
    gameboard.at('a3').place(secondRook);

    const allValidMoves = gameboard.at('a1').getAllValidMoves();
    const expected = ['a2', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is in behind of piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook('white');
    const secondRook = Rook('black');
    gameboard.at('a3').place(rook);
    gameboard.at('a2').place(secondRook);

    const allValidMoves = gameboard.at('a3').getAllValidMoves();
    const expected = [
      'a2',
      'a4',
      'a5',
      'a6',
      'a7',
      'a8',
      'b3',
      'c3',
      'd3',
      'e3',
      'f3',
      'g3',
      'h3',
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is both in front and behind a piece on vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook('white');
    const secondRook = Rook('black');
    const thirdRook = Rook('black');

    gameboard.at('a5').place(rook);
    gameboard.at('a3').place(secondRook);
    gameboard.at('a7').place(thirdRook);

    const allValidMoves = gameboard.at('a5').getAllValidMoves();
    const expected = [
      'a3',
      'a4',
      'a6',
      'a7',
      'b5',
      'c5',
      'd5',
      'e5',
      'f5',
      'g5',
      'h5',
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is in front of piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = Rook('black');
    const secondRook = Rook('white');
    gameboard.at('a1').place(rook);
    gameboard.at('c1').place(secondRook);
    const allValidMoves = gameboard.at('a1').getAllValidMoves();
    const expected = ['a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'c1'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is behind piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = Rook('black');
    const secondRook = Rook('white');
    gameboard.at('b1').place(rook);
    gameboard.at('d1').place(secondRook);
    const allValidMoves = gameboard.at('d1').getAllValidMoves();

    const expected = [
      'd2',
      'd3',
      'd4',
      'd5',
      'd6',
      'd7',
      'd8',
      'b1',
      'c1',
      'e1',
      'f1',
      'g1',
      'h1',
    ];
    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is both behind and in front of piece on horizontal axis', () => {
    const gameboard = Gameboard();
    const rook = Rook('white');
    const secondRook = Rook('black');
    const thirdRook = Rook('white');

    gameboard.at('b1').place(rook);
    gameboard.at('d1').place(secondRook);
    gameboard.at('g1').place(thirdRook);

    const allValidMoves = gameboard.at('d1').getAllValidMoves();
    const expected = [
      'd2',
      'd3',
      'd4',
      'd5',
      'd6',
      'd7',
      'd8',
      'b1',
      'c1',
      'e1',
      'f1',
      'g1',
    ];
    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is both behind and in front of piece on horizontal and vertical axis', () => {
    const gameboard = Gameboard();
    const rook = Rook('black');
    const secondRook = Rook('white');
    const thirdRook = Rook('black');
    const fourthRook = Rook('black');
    const fifthRook = Rook('black');

    gameboard.at('b5').place(rook);
    gameboard.at('d5').place(secondRook);
    gameboard.at('g5').place(thirdRook);
    gameboard.at('d3').place(fourthRook);
    gameboard.at('d7').place(fifthRook);

    const allValidMoves = gameboard.at('d5').getAllValidMoves();
    const expected = ['d3', 'd4', 'd6', 'd7', 'b5', 'c5', 'e5', 'f5', 'g5'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });
});

describe('testing getAllValidMoves for Bishop', () => {
  test('no obstructions', () => {
    const gameboard = Gameboard();
    const bishop = Bishop();

    gameboard.at('d4').place(bishop);

    const allValidMoves = gameboard.at('d4').getAllValidMoves();
    const expected = [
      'c3',
      'b2',
      'a1',
      'e5',
      'f6',
      'g7',
      'h8',
      'e3',
      'f2',
      'g1',
      'c5',
      'b6',
      'a7',
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is on right/up diagonal', () => {
    const gameboard = Gameboard();
    const bishop = Bishop('white');
    const secondBishop = Bishop('black');

    gameboard.at('d4').place(bishop);
    gameboard.at('f6').place(secondBishop);

    const allValidMoves = gameboard.at('d4').getAllValidMoves();
    const expected = [
      'c3',
      'b2',
      'a1',
      'e5',
      'f6',
      'e3',
      'f2',
      'g1',
      'c5',
      'b6',
      'a7',
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('obstruction is on left/up diagonal', () => {
    const gameboard = Gameboard();
    const bishop = Bishop('white');
    const secondBishop = Bishop('white');

    gameboard.at('d4').place(bishop);
    gameboard.at('b6').place(secondBishop);

    const allValidMoves = gameboard.at('d4').getAllValidMoves();
    const expected = [
      'c3',
      'b2',
      'a1',
      'e5',
      'f6',
      'g7',
      'h8',
      'e3',
      'f2',
      'g1',
      'c5',
    ];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });
});

describe('testing getAllValidMoves for Knight', () => {
  test('getAllValidMoves works', () => {
    const gameboard = Gameboard();
    const knight = Knight();

    gameboard.at('d4').place(knight);

    const allValidMoves = gameboard.at('d4').getAllValidMoves();
    const expected = ['c6', 'e6', 'c2', 'e2', 'b5', 'b3', 'f5', 'f3'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });

  test('removes moves with own pieces', () => {
    const gameboard = Gameboard();
    const knight = Knight('white');
    const rook = Rook('white');
    const rook2 = Rook('white');
    const rook3 = Rook('white');
    const rook4 = Rook('white');
    const rook5 = Rook('white');
    const rook6 = Rook('white');
    const rook7 = Rook('white');
    const rook8 = Rook('white');

    gameboard.at('d4').place(knight);
    gameboard.at('c2').place(rook);
    gameboard.at('c6').place(rook2);
    gameboard.at('e6').place(rook3);
    gameboard.at('e2').place(rook4);
    gameboard.at('b5').place(rook5);
    gameboard.at('b3').place(rook5);
    gameboard.at('f5').place(rook7);
    gameboard.at('f3').place(rook8);

    const allValidMoves = gameboard.at('d4').getAllValidMoves();
    const expected = [];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });
});

describe('testing getAllValidMoves for Pawn (white)', () => {
  test('no obstructions', () => {
    const gameboard = Gameboard();
    const piece = Pawn('white');

    gameboard.at('e2').place(piece);

    const allValidMoves = gameboard.at('e2').getAllValidMoves();
    const expected = ['e4', 'e3'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });
  test('captures', () => {
    const gameboard = Gameboard();
    const piece = Pawn('white');
    const pieceToBeCaptured = Pawn('black');

    gameboard.at('e2').place(piece);
    gameboard.at('d3').place(pieceToBeCaptured);

    const allValidMoves = gameboard.at('e2').getAllValidMoves();
    const expected = ['e4', 'e3', 'd3'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });
  test('cant capture own piece', () => {
    const gameboard = Gameboard();
    const piece = Pawn('white');
    const ownPiece = Pawn('white');

    gameboard.at('e2').place(piece);
    gameboard.at('d3').place(ownPiece);

    const allValidMoves = gameboard.at('e2').getAllValidMoves();
    const expected = ['e4', 'e3'];

    expect(allValidMoves).toEqual(expect.arrayContaining(expected));
    expect(allValidMoves.length).toBe(expected.length);
  });
});
