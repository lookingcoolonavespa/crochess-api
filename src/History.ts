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
