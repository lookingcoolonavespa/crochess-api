/* eslint-disable no-undef */
import History from '../src/History';

test('correctly inserts new move', () => {
  const history1 = [['e4']];
  const afterInsert = History(history1).insertMove('e5');
  expect(afterInsert).toEqual([['e4', 'e5']]);
  expect(history1[0]).not.toEqual(afterInsert[0]);

  const history2 = History(afterInsert).insertMove('d4');
  expect(history2).toEqual([['e4', 'e5'], ['d4']]);
});
