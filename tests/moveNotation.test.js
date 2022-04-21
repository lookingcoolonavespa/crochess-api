/* eslint-disable no-undef */
import moveNotation from '../src/moveNotation';

describe('piece move', () => {
  test('correct piece prefix', () => {
    const kingMove = moveNotation('e2').get({
      pieceType: 'king'
    });
    const queenMove = moveNotation('e2').get({
      pieceType: 'queen'
    });
    const knightMove = moveNotation('e2').get({
      pieceType: 'knight'
    });
    const bishopMove = moveNotation('e2').get({
      pieceType: 'bishop'
    });
    const rookMove = moveNotation('e2').get({
      pieceType: 'rook'
    });

    expect(kingMove).toBe('Ke2');
    expect(queenMove).toBe('Qe2');
    expect(knightMove).toBe('Ne2');
    expect(bishopMove).toBe('Be2');
    expect(rookMove).toBe('Re2');
  });

  test('w/ capture, check, and differentiation', () => {
    const rookMove = moveNotation('e2').get({
      pieceType: 'rook',
      capture: true,
      check: true,
      differentiation: 'b'
    });

    expect(rookMove).toBe('Rbxe2+');
  });
});

describe('pawn move', () => {
  test('w/ capture, check, differentiation, and promotion', () => {
    const pawnMove = moveNotation('b8').get({
      pieceType: 'pawn',
      capture: true,
      check: true,
      differentiation: 'a',
      promote: 'queen'
    });

    expect(pawnMove).toBe('axb8=Q+');
  });
});

test('castles', () => {
  const kingside = moveNotation().get({ castle: 'kingside' });
  const queenside = moveNotation().get({ castle: 'queenside' });

  expect(kingside).toBe('0-0');
  expect(queenside).toBe('0-0-0');
});
