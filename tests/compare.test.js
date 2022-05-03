/* eslint-disable no-undef */
import { compareObjects } from '../src/utils/compare';

describe('compareObjects', () => {
  test('works', () => {
    const obj1 = {
      a: 1
    };

    const obj2 = {
      a: 1
    };

    const obj3 = {
      a: 2
    };

    expect(compareObjects(obj1, obj2)).toBe(true);
    expect(compareObjects(obj1, obj3)).toBe(false);
  });

  test('works with nested objects', () => {
    const obj1 = {
      a: {
        b: 1
      }
    };

    const obj2 = {
      a: {
        b: 1
      }
    };

    const obj3 = {
      a: {
        b: 2
      }
    };

    expect(compareObjects(obj1, obj2)).toBe(true);
    expect(compareObjects(obj1, obj3)).toBe(false);
  });

  test('works with arrays in nested object', () => {
    const obj1 = {
      a: {
        b: [1]
      }
    };

    const obj2 = {
      a: {
        b: [1]
      }
    };

    const obj3 = {
      a: {
        b: [2]
      }
    };

    expect(compareObjects(obj1, obj2)).toBe(true);
    expect(compareObjects(obj1, obj3)).toBe(false);
  });
});
