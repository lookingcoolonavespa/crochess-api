import game from '../game';

test('init places pieces correctly', () => {
  game.init();

  const board = game.gameboard.board;
  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  cols.forEach((col) => {
    expect(board[col.concat(2)].piece.type).toBe('pawn');
    expect(board[col.concat(2)].piece.color).toBe('white');
    expect(board[col.concat(7)].piece.type).toBe('pawn');
    expect(board[col.concat(7)].piece.color).toBe('black');
  });
});
