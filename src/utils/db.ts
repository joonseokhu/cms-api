import { User } from '@models/user.model';

export const optionalFindQuery = (query: any): any => Object
  .entries(query)
  .reduce((acc, [key, value]) => (
    (value === undefined) ? acc : { ...acc, [key]: value }
  ), {});

export const AddOption = (common: any, options: any[]): any[] => (
  options.map(option => ({
    ...optionalFindQuery(common),
    ...optionalFindQuery(option),
  }))
);
