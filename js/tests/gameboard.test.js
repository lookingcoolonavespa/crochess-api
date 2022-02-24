import Gameboard from '../gameboard';

const gameboard = Gameboard();

test('gameboard is correct', () => {
  expect(gameboard.board.length).toBe(64);
});
