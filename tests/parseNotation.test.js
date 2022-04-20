/* eslint-disable no-undef */
import { parseNotation } from '../src/utils/helpers';

test('castle notation', () => {
  const kingsideCastle = parseNotation('0-0');
  const queensideCastle = parseNotation('0-0-0');

  expect(kingsideCastle.castle).toBe('kingside');
  expect(queensideCastle.castle).toBe('queenside');
});

describe('piece notation', () => {
  test('gets correct piece type', () => {
    const kingMove = parseNotation('Ke2');
    const queenMove = parseNotation('Qe2');
    const knightMove = parseNotation('Ne2');
    const bishopMove = parseNotation('Be2');
    const rookMove = parseNotation('Re2');

    expect(kingMove.pieceType).toBe('king');
    expect(queenMove.pieceType).toBe('queen');
    expect(knightMove.pieceType).toBe('knight');
    expect(bishopMove.pieceType).toBe('bishop');
    expect(rookMove.pieceType).toBe('rook');
  });
  test('gets correct move', () => {
    const kingMove = parseNotation('Ke2');
    const captureMove = parseNotation('Kxe2');

    expect(kingMove.to).toBe('e2');
    expect(captureMove.to).toBe('e2');
  });
  test('when multiple pieces can go to same square', () => {
    const fileMove = parseNotation('Nba5');
    const rankMove = parseNotation('N3a5');

    expect(fileMove.from).toBe('b');
    expect(rankMove.from).toBe('3');
  });
});

describe('pawn notation', () => {
  test('regular move works', () => {
    const pawnMove = parseNotation('e4');

    expect(pawnMove).toEqual({
      pieceType: 'pawn',
      to: 'e4'
    });
  });
  test('promotion works', () => {
    const promoteMove = parseNotation('a8=Q');
    const captureToPromote = parseNotation('bxa8=Q');

    expect(promoteMove.pieceType).toBe('pawn');
    expect(promoteMove.promote).toBe('queen');
    expect(promoteMove.to).toBe('a8');
    expect(captureToPromote.to).toBe('a8');
    expect(captureToPromote.from).toBe('b');
  });
});

describe('check notation doesnt get in the way', () => {
  test('on promotion', () => {
    const promoteMove = parseNotation('a8=Q+');

    expect(promoteMove.pieceType).toBe('pawn');
    expect(promoteMove.promote).toBe('queen');
    expect(promoteMove.to).toBe('a8');
  });

  test('when multiple pieces can go to same square', () => {
    const fileMove = parseNotation('Nba5+');
    const rankMove = parseNotation('N3a5+');

    expect(fileMove.from).toBe('b');
    expect(rankMove.from).toBe('3');
  });
});
