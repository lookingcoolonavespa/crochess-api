import moves from '../utils/moves';
import { toXY } from '../utils/helpers';

import { Color, Square } from '../types/types';

const Bishop = (color: Color) => {
  const type = 'bishop' as const;

  function isValidMove(target: Square, current: Square) {
    return target !== current && moves.diagonal(toXY(current))(toXY(target));
  }

  return {
    isValidMove,
    get color() {
      return color;
    },
    get type() {
      return type;
    }
  };
};

export default Bishop;
