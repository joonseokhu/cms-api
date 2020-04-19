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

// const getRegexQuery = (arg: any) => (
//   Object.entries(arg).reduce((acc, [key, value]) => {
//     if (value === undefined) return acc;
//     return {
//       ...acc,
//       [key]: { $regex: `.*${value}.*` },
//     };
//   }, {})
// );

// const findByString = (...args: any[]) => {
//   const queries = args.map(arg => getRegexQuery(arg));
//   return {
//     $or: queries,
//   };
// };

const findByString = (keys: string|string[], value: string) => {
  const findKeys = Array.isArray(keys) ? keys : [keys];
  const resultQueries = findKeys.map(key => {
    if (!value) return {};
    const regexString = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return {
      [key]: { $regex: `.*${regexString}.*` },
    };
  });
  console.log('queries', resultQueries);
  return { $or: resultQueries };
};

// findByString({ title, content }, [
//   ['title'],
//   ['content'],
//   ['title', 'content'],
// ]);

export const useQuery = {
  optionals,
  findByString,
};
