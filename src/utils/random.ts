export const hasValue = (value: any) => {
  if (value === undefined) return false;
  if (value === null) return false;
  if (value === '') return false;
  return true;
};

export const getRandomInt = (from: number = 0, to: number = 10000): number => {
  const min = Math.ceil(from);
  const max = Math.floor(to);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const work = (src: T[]): T[] => {
    const ret = [...src];
    for (let prevKey = 0; prevKey < ret.length; prevKey += 1) {
      const nextKey = getRandomInt(0, ret.length - 1);
      const prevValue = ret[prevKey];
      ret[prevKey] = ret[nextKey];
      ret[nextKey] = prevValue;
    }
    return ret;
  };
  return work(work(array));
};

export const createArray = (from: number, to?: number): number[] => {
  if (!from || (to && to < from)) {
    throw new Error('Invalid usage');
  }
  const length = to
    ? to - from + 1
    : from;
  const arr = [...Array(length).keys()].map(index => (
    to ? (from + index) : index
  ));
  return arr;
};

export const pickFromArray = <T>(array: T[], length: number = 1): T[] => (
  shuffleArray<T>(array).slice(0, length)
);

/**
 * @todo 대소숫 글자타입별 사용여부 & 최소길이 정할수있게
 */

export const getRandomChars = (length: number = 1) => {
  const chars = {
    number: '0123456789',
    upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowerCase: 'abcdefghijklmnopqrstuvwxyz',
  };
  const allChars: string[] = (chars.number + chars.upperCase + chars.lowerCase).split('');
  return pickFromArray<string>(allChars, length).join('');
};
