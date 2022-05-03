/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject } from './helpers';

function compare1dArray(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

export function compareObjects(
  obj1: { [key: string]: any },
  obj2: { [key: string]: any }
): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i];

    switch (true) {
      case isObject(obj1[key]) && isObject(obj2[key]): {
        if (!compareObjects(obj1[key], obj2[key])) return false;
        break;
      }

      case Array.isArray(obj1[key]) && Array.isArray(obj2[key]): {
        if (!compare1dArray(obj1[key], obj2[key])) return false;
        break;
      }

      default: {
        if (obj1[key] !== obj2[key]) return false;
      }
    }
  }

  return true;
}

export function compare1dArrayNoOrder(arr1: any[], arr2: any[]) {
  return arr1.length === arr2.length && arr1.every((v) => arr2.includes(v));
}
