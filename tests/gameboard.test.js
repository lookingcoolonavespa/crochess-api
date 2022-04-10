/* eslint-disable no-undef */
import Gameboard from '../src/Gameboard';
import Piece from '../src/Piece';

test('gameboard is correct', () => {
  const gameboard = Gameboard().createBoard();
  expect(gameboard.size).toBe(64);
});

test('gameboard places pieces correctly', () => {
  const board = Gameboard().createBoard();
  const gameboard = Gameboard(board);
  const rook = { type: 'rook', color: 'white' };
  gameboard.at('a1').place({ type: 'rook', color: 'white' });
  expect(gameboard.at('a1').piece).toEqual(rook);
});

test('gameboard.at.place doesnt accept invalid squares', () => {
  const board = Gameboard().createBoard();
  const gameboard = Gameboard(board);
  const rook = { type: 'rook', color: 'white' };
  expect(gameboard.at('a0').place(rook)).toBe('square does not exist');
});

test('gameboard moves pieces correctly', () => {
  const board = Gameboard().createBoard();
  const gameboard = Gameboard(board);
  const rook = { type: 'rook', color: 'white' };
  gameboard.at('a1').place(rook);
  gameboard.from('a1').to('a2');
  expect(gameboard.at('a2').piece).toEqual(rook);
  expect(gameboard.at('a1').piece).toBe(null);
});

describe('hasMove works correctly for each piece', () => {
  test('rook', () => {
    const piece = Piece('white', 'rook');
    expect(piece.hasMove('a1', 'a2')).toBe(true);
    expect(piece.hasMove('a1', 'b2')).toBe(false);
  });
  test('pawn', () => {
    const piece = Piece('white', 'pawn');
    expect(piece.hasMove('e2', 'e3')).toBe(true);
    expect(piece.hasMove('e2', 'e4')).toBe(true);
    expect(piece.hasMove('e2', 'b2')).toBe(false);
  });
});

// describe('testing getValidMoves for Rook', () => {
//   test('no obstructions', () => {
//     const gameboard = Gameboard();
//     const rook = Rook();
//     gameboard.at('a1').place(rook);

//     const allValidMoves = gameboard.at('a1').getValidMoves();
//     const expected = [
//       'a2',
//       'a3',
//       'a4',
//       'a5',
//       'a6',
//       'a7',
//       'a8',
//       'b1',
//       'c1',
//       'd1',
//       'e1',
//       'f1',
//       'g1',
//       'h1'
//     ];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is in front of piece on vertical axis', () => {
//     const gameboard = Gameboard();
//     const rook = Rook('white');
//     const secondRook = Rook('white');
//     gameboard.at('a1').place(rook);
//     gameboard.at('a3').place(secondRook);

//     const allValidMoves = gameboard.at('a1').getValidMoves();
//     const expected = ['a2', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is in behind of piece on vertical axis', () => {
//     const gameboard = Gameboard();
//     const rook = Rook('white');
//     const secondRook = Rook('black');
//     gameboard.at('a3').place(rook);
//     gameboard.at('a2').place(secondRook);

//     const allValidMoves = gameboard.at('a3').getValidMoves();
//     const expected = [
//       'a2',
//       'a4',
//       'a5',
//       'a6',
//       'a7',
//       'a8',
//       'b3',
//       'c3',
//       'd3',
//       'e3',
//       'f3',
//       'g3',
//       'h3'
//     ];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is both in front and behind a piece on vertical axis', () => {
//     const gameboard = Gameboard();
//     const rook = Rook('white');
//     const secondRook = Rook('black');
//     const thirdRook = Rook('black');

//     gameboard.at('a5').place(rook);
//     gameboard.at('a3').place(secondRook);
//     gameboard.at('a7').place(thirdRook);

//     const allValidMoves = gameboard.at('a5').getValidMoves();
//     const expected = [
//       'a3',
//       'a4',
//       'a6',
//       'a7',
//       'b5',
//       'c5',
//       'd5',
//       'e5',
//       'f5',
//       'g5',
//       'h5'
//     ];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is in front of piece on horizontal axis', () => {
//     const gameboard = Gameboard();
//     const rook = Rook('black');
//     const secondRook = Rook('white');
//     gameboard.at('a1').place(rook);
//     gameboard.at('c1').place(secondRook);
//     const allValidMoves = gameboard.at('a1').getValidMoves();
//     const expected = ['a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'b1', 'c1'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is behind piece on horizontal axis', () => {
//     const gameboard = Gameboard();
//     const rook = Rook('black');
//     const secondRook = Rook('white');
//     gameboard.at('b1').place(rook);
//     gameboard.at('d1').place(secondRook);
//     const allValidMoves = gameboard.at('d1').getValidMoves();

//     const expected = [
//       'd2',
//       'd3',
//       'd4',
//       'd5',
//       'd6',
//       'd7',
//       'd8',
//       'b1',
//       'c1',
//       'e1',
//       'f1',
//       'g1',
//       'h1'
//     ];
//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is both behind and in front of piece on horizontal axis', () => {
//     const gameboard = Gameboard();
//     const rook = Rook('white');
//     const secondRook = Rook('black');
//     const thirdRook = Rook('white');

//     gameboard.at('b1').place(rook);
//     gameboard.at('d1').place(secondRook);
//     gameboard.at('g1').place(thirdRook);

//     const allValidMoves = gameboard.at('d1').getValidMoves();
//     const expected = [
//       'd2',
//       'd3',
//       'd4',
//       'd5',
//       'd6',
//       'd7',
//       'd8',
//       'b1',
//       'c1',
//       'e1',
//       'f1',
//       'g1'
//     ];
//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is both behind and in front of piece on horizontal and vertical axis', () => {
//     const gameboard = Gameboard();
//     const rook = Rook('black');
//     const secondRook = Rook('white');
//     const thirdRook = Rook('black');
//     const fourthRook = Rook('black');
//     const fifthRook = Rook('black');

//     gameboard.at('b5').place(rook);
//     gameboard.at('d5').place(secondRook);
//     gameboard.at('g5').place(thirdRook);
//     gameboard.at('d3').place(fourthRook);
//     gameboard.at('d7').place(fifthRook);

//     const allValidMoves = gameboard.at('d5').getValidMoves();
//     const expected = ['d3', 'd4', 'd6', 'd7', 'b5', 'c5', 'e5', 'f5', 'g5'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
// });

// describe('testing getValidMoves for Bishop', () => {
//   test('no obstructions', () => {
//     const gameboard = Gameboard();
//     const bishop = Bishop();

//     gameboard.at('d4').place(bishop);

//     const allValidMoves = gameboard.at('d4').getValidMoves();
//     const expected = [
//       'c3',
//       'b2',
//       'a1',
//       'e5',
//       'f6',
//       'g7',
//       'h8',
//       'e3',
//       'f2',
//       'g1',
//       'c5',
//       'b6',
//       'a7'
//     ];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is on right/up diagonal', () => {
//     const gameboard = Gameboard();
//     const bishop = Bishop('white');
//     const secondBishop = Bishop('black');

//     gameboard.at('d4').place(bishop);
//     gameboard.at('f6').place(secondBishop);

//     const allValidMoves = gameboard.at('d4').getValidMoves();
//     const expected = [
//       'c3',
//       'b2',
//       'a1',
//       'e5',
//       'f6',
//       'e3',
//       'f2',
//       'g1',
//       'c5',
//       'b6',
//       'a7'
//     ];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('obstruction is on left/up diagonal', () => {
//     const gameboard = Gameboard();
//     const bishop = Bishop('white');
//     const secondBishop = Bishop('white');

//     gameboard.at('d4').place(bishop);
//     gameboard.at('b6').place(secondBishop);

//     const allValidMoves = gameboard.at('d4').getValidMoves();
//     const expected = [
//       'c3',
//       'b2',
//       'a1',
//       'e5',
//       'f6',
//       'g7',
//       'h8',
//       'e3',
//       'f2',
//       'g1',
//       'c5'
//     ];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
// });

// describe('testing getValidMoves for Knight', () => {
//   test('getValidMoves works', () => {
//     const gameboard = Gameboard();
//     const knight = Knight();

//     gameboard.at('d4').place(knight);

//     const allValidMoves = gameboard.at('d4').getValidMoves();
//     const expected = ['c6', 'e6', 'c2', 'e2', 'b5', 'b3', 'f5', 'f3'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });

//   test('removes moves with own pieces', () => {
//     const gameboard = Gameboard();
//     const knight = Knight('white');
//     const rook = Rook('white');
//     const rook2 = Rook('white');
//     const rook3 = Rook('white');
//     const rook4 = Rook('white');
//     const rook5 = Rook('white');
//     const rook6 = Rook('white');
//     const rook7 = Rook('white');
//     const rook8 = Rook('white');

//     gameboard.at('d4').place(knight);
//     gameboard.at('c2').place(rook);
//     gameboard.at('c6').place(rook2);
//     gameboard.at('e6').place(rook3);
//     gameboard.at('e2').place(rook4);
//     gameboard.at('b5').place(rook5);
//     gameboard.at('b3').place(rook6);
//     gameboard.at('f5').place(rook7);
//     gameboard.at('f3').place(rook8);

//     const allValidMoves = gameboard.at('d4').getValidMoves();
//     const expected = [];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
// });

// describe('testing getValidMoves for Pawn (white)', () => {
//   test('no obstructions', () => {
//     const gameboard = Gameboard();
//     const piece = Pawn('white');

//     gameboard.at('e2').place(piece);

//     const allValidMoves = gameboard.at('e2').getValidMoves();
//     const expected = ['e4', 'e3'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
//   test('captures', () => {
//     const gameboard = Gameboard();
//     const piece = Pawn('white');
//     const pieceToBeCaptured = Pawn('black');

//     gameboard.at('e2').place(piece);
//     gameboard.at('d3').place(pieceToBeCaptured);

//     const allValidMoves = gameboard.at('e2').getValidMoves();
//     const expected = ['e4', 'e3', 'd3'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
//   test('cant capture own piece', () => {
//     const gameboard = Gameboard();
//     const piece = Pawn('white');
//     const ownPiece = Pawn('white');

//     gameboard.at('e2').place(piece);
//     gameboard.at('d3').place(ownPiece);

//     const allValidMoves = gameboard.at('e2').getValidMoves();
//     const expected = ['e4', 'e3'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
//   test('cant move when obstruction is same color', () => {
//     const gameboard = Gameboard();
//     const piece = Pawn('white');
//     const ownPiece = Pawn('white');

//     gameboard.at('e2').place(piece);
//     gameboard.at('e3').place(ownPiece);

//     const allValidMoves = gameboard.at('e2').getValidMoves();
//     const expected = [];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
//   test('cant move when obstruction is opposite color', () => {
//     const gameboard = Gameboard();
//     const piece = Pawn('white');
//     const oppPiece = Pawn('black');

//     gameboard.at('e2').place(piece);
//     gameboard.at('e3').place(oppPiece);

//     const allValidMoves = gameboard.at('e2').getValidMoves();
//     const expected = [];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
//   test('en passant', () => {
//     const gameboard = Gameboard();
//     const piece = Pawn('black');
//     const pieceToBeCaptured = Pawn('white');

//     gameboard.at('e2').place(pieceToBeCaptured);
//     gameboard.at('d5').place(piece);
//     gameboard.from('d5').to('d4');
//     gameboard.from('e2').to('e4');

//     const allValidMoves = gameboard.at('d4').getValidMoves();
//     const expected = ['d3', 'e3'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
//   test('en passant doesnt work for own pawns', () => {
//     const gameboard = Gameboard();
//     const piece = Pawn('black');
//     const otherPawn = Pawn('black');

//     gameboard.at('e7').place(piece);
//     gameboard.at('d7').place(otherPawn);
//     gameboard.from('e7').to('e5');

//     const allValidMoves = gameboard.at('d7').getValidMoves();
//     const expected = ['d6', 'd5'];

//     expect(allValidMoves).toEqual(expect.arrayContaining(expected));
//     expect(allValidMoves.length).toBe(expected.length);
//   });
// });

// describe('testing gameboard.from.to', () => {
//   test('capture by en passant works', () => {
//     const gameboard = Gameboard();
//     const piece = Pawn('black');
//     const pieceToBeCaptured = Pawn('white');

//     gameboard.at('e2').place(pieceToBeCaptured);
//     gameboard.at('d5').place(piece);
//     gameboard.from('d5').to('d4');
//     gameboard.from('e2').to('e4');
//     gameboard.from('d4').to('e3');

//     expect(gameboard.at('e4').piece).toBe(null);
//   });
// });

// describe('testing gameboard.check functions', () => {
//   describe('inCheck works', () => {
//     test('when piece hits king after it moves', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppRook = Rook('black');
//       const oppRookStartSquare = 'a8';
//       const oppRookEndSquare = 'e8';

//       gameboard.at('e1').place(king);
//       gameboard.at('a8').place(oppRook);

//       gameboard.from(oppRookStartSquare).to(oppRookEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppRookStartSquare,
//         oppRookEndSquare
//       );

//       expect(piecesGivingCheck).toEqual(['e8']);
//     });
//     test('no false positive', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppRook = Rook('black');
//       const oppRookStartSquare = 'a8';
//       const oppRookEndSquare = 'a8';

//       gameboard.at('e1').place(king);
//       gameboard.at('a8').place(oppRook);

//       gameboard.from(oppRookStartSquare).to(oppRookEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppRookStartSquare,
//         oppRookEndSquare
//       );

//       expect(piecesGivingCheck).toEqual([]);
//     });
//     test('discovered check by rook vertically', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppRook = Rook('black');
//       const oppBishop = Bishop('black');
//       const oppBishopStartSquare = 'e7';
//       const oppBishopEndSquare = 'f8';

//       gameboard.at('e1').place(king);
//       gameboard.at('e8').place(oppRook);
//       gameboard.at(oppBishopStartSquare).place(oppBishop);

//       gameboard.from(oppBishopStartSquare).to(oppBishopEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppBishopStartSquare,
//         oppBishopEndSquare
//       );

//       expect(piecesGivingCheck).toEqual(['e8']);
//     });
//     test('no false positive on vertical axis', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppPawn = Pawn('black');
//       const oppBishop = Bishop('black');
//       const oppBishopStartSquare = 'e7';
//       const oppBishopEndSquare = 'f8';

//       gameboard.at('e1').place(king);
//       gameboard.at('e8').place(oppPawn);
//       gameboard.at(oppBishopStartSquare).place(oppBishop);

//       gameboard.from(oppBishopStartSquare).to(oppBishopEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppBishopStartSquare,
//         oppBishopEndSquare
//       );

//       expect(piecesGivingCheck).toEqual([]);
//     });
//     test('discovered check by rook laterally', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppRook = Rook('black');
//       const oppBishop = Bishop('black');
//       const oppBishopStartSquare = 'b1';
//       const oppBishopEndSquare = 'c2';

//       gameboard.at('e1').place(king);
//       gameboard.at('a1').place(oppRook);
//       gameboard.at(oppBishopStartSquare).place(oppBishop);

//       gameboard.from(oppBishopStartSquare).to(oppBishopEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppBishopStartSquare,
//         oppBishopEndSquare
//       );

//       expect(piecesGivingCheck).toEqual(['a1']);
//     });
//     test('no false positive laterally', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppKnight = Knight('black');
//       const oppBishop = Bishop('black');
//       const oppBishopStartSquare = 'b1';
//       const oppBishopEndSquare = 'c2';

//       gameboard.at('e1').place(king);
//       gameboard.at('a1').place(oppKnight);
//       gameboard.at(oppBishopStartSquare).place(oppBishop);

//       gameboard.from(oppBishopStartSquare).to(oppBishopEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppBishopStartSquare,
//         oppBishopEndSquare
//       );

//       expect(piecesGivingCheck).toEqual([]);
//     });
//     test('discovered check by bishop', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppRook = Rook('black');
//       const oppBishop = Bishop('black');
//       const oppRookStartSquare = 'b4';
//       const oppRookEndSquare = 'b8';

//       gameboard.at('e1').place(king);
//       gameboard.at('a5').place(oppBishop);
//       gameboard.at(oppRookStartSquare).place(oppRook);

//       gameboard.from(oppRookStartSquare).to(oppRookEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppRookStartSquare,
//         oppRookEndSquare
//       );

//       expect(piecesGivingCheck).toEqual(['a5']);
//     });
//     test('check by knight', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppKnight = Knight('black');
//       const oppKnightStartSquare = 'e5';
//       const oppKnightEndSquare = 'f3';

//       gameboard.at('e1').place(king);
//       gameboard.at(oppKnightStartSquare).place(oppKnight);

//       gameboard.from(oppKnightStartSquare).to(oppKnightEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppKnightStartSquare,
//         oppKnightEndSquare
//       );

//       expect(piecesGivingCheck).toEqual(['f3']);
//     });
//     test('check by knight, no false positive', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppKnight = Knight('black');
//       const oppKnightStartSquare = 'e5';
//       const oppKnightEndSquare = 'g4';

//       gameboard.at('e1').place(king);
//       gameboard.at(oppKnightStartSquare).place(oppKnight);

//       gameboard.from(oppKnightStartSquare).to(oppKnightEndSquare);

//       const piecesGivingCheck = gameboard.check.inCheckAfterMove(
//         oppKnightStartSquare,
//         oppKnightEndSquare
//       );

//       expect(piecesGivingCheck).toEqual([]);
//     });
//   });

//   describe('checkmate works', () => {
//     test('back rank mate', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppRook = Rook('black');

//       gameboard.at('h1').place(king);
//       gameboard.at('h2').place(Pawn('white'));
//       gameboard.at('g2').place(Pawn('white'));
//       gameboard.at('f1').place(oppRook);

//       const squaresGivingCheck = gameboard.check.inCheckAfterMove('f1', 'f1');
//       const checkmate = gameboard.check.checkmate('white', squaresGivingCheck);

//       expect(checkmate).toBe(true);
//     });
//     test('mate with protected pawn ', () => {
//       const gameboard = Gameboard();
//       const king = King('white');

//       gameboard.at('a1').place(king);
//       gameboard.at('b2').place(Pawn('black'));
//       gameboard.at('a3').place(Pawn('black'));
//       gameboard.at('c3').place(Knight('black'));

//       const squaresGivingCheck = gameboard.check.inCheckAfterMove('b2', 'b2');
//       const checkmate = gameboard.check.checkmate('white', squaresGivingCheck);

//       expect(checkmate).toBe(true);
//     });
//     test('calcBlockOrCaptureCheck works', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppRook = Rook('black');
//       const blockRook = Rook('white');

//       gameboard.at('h1').place(king);
//       gameboard.at('h2').place(Pawn('white'));
//       gameboard.at('g2').place(Pawn('white'));
//       gameboard.at('a1').place(oppRook);
//       gameboard.at('b8').place(blockRook);

//       const squaresGivingCheck = gameboard.check.inCheckAfterMove('a1', 'a1');
//       const checkmate = gameboard.check.checkmate('white', squaresGivingCheck);

//       expect(checkmate).toBe(false);
//     });
//     test('cant block knight check', () => {
//       const gameboard = Gameboard();
//       const king = King('white');
//       const oppKnight = Knight('black');

//       gameboard.at('h1').place(king);
//       gameboard.at('h2').place(Bishop('white'));
//       gameboard.at('g2').place(Bishop('white'));
//       gameboard.at('g1').place(Rook('white'));
//       gameboard.at('f2').place(oppKnight);

//       const squaresGivingCheck = gameboard.check.inCheckAfterMove('f2', 'f2');
//       const checkmate = gameboard.check.checkmate('white', squaresGivingCheck);

//       expect(checkmate).toBe(true);
//     });
//   });
// });
