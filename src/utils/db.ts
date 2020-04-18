// import { User } from '@models/user.model';

const optionals = <T>(query: any): Partial<T> => Object
  .entries(query)
  .reduce((acc, [key, value]) => (
    (value === undefined) ? acc : { ...acc, [key]: value }
  ), {});
// export const AddOption = (common: any, options: any[]): any[] => (
//   options.map(option => ({
//     ...optionals(common),
//     ...optionals(option),
//   }))
// );

export const isStringEnum = (Enum: any, value: string) => (
  Object.values(Enum).includes(value)
);

export const optionalEnum = <T>(Enum: any, value: string): T => (
  isStringEnum(Enum, value) ? Enum[value] : undefined
);

const getRegexQuery = (arg: any) => (
  Object.entries(arg).reduce((acc, [key, value]) => {
    if (value === undefined) return acc;
    return {
      ...acc,
      [key]: { $regex: `.*${value}.*` },
    };
  }, {})
);

const findByString = (...args: any[]) => {
  const queries = args.map(arg => getRegexQuery(arg));
  return {
    $or: queries,
  };
};

export const useQuery = {
  optionals,
  findByString,
};
