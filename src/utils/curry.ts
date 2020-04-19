const map = <I = any, O = any>(fn: (value: I, index?: number) => O) => (values: I[]): O[] => (
  values.map(fn)
);

const filter = <I = any>(fn: (value: I, index?: number) => boolean) => (
  (values: I[]): Partial<I[]> => (
    values.filter(fn)
  )
);

const reduce = <I = any>(fn: (acc: any, value: I, index?: number) => any, initial: any) => (
  (values: I[]) => (
    values.reduce(fn, initial)
  )
);

export const array = {
  map,
  filter,
  reduce,
};

export const log = (message: any) => (value: any) => {
  console.log(message, value);
  return value;
};
