// should output history object that holds move history in 2d array
// for each move needs to attach piece Type to beginning of move if not pawn
// should further specify square of piece if, say both rooks, can move to same square

import { HistoryObj } from './types/interfaces';
import { HistoryType } from './types/types';
import { deepCopy2dArray } from './utils/helpers';

export default function History(prevHistory: HistoryType): HistoryObj {
  const history: HistoryType = deepCopy2dArray(prevHistory) || [];

  return {
    insertMove: (notation: string) => {
      const lastPair = history[history.length - 1];
      if (lastPair && lastPair.length === 1) {
        lastPair.push(notation);
      } else {
        const newPair = [notation];
        history.push(newPair);
      }

      return history;
    }
  };
}
