import { Query } from '../../core';
import { BASE_URL } from '../../endpoints';
import { CategoryKey } from './types';

export const queries: Record<CategoryKey, Query> = {
  categories: new Query({
    url: `${BASE_URL}/list.php?c=list`,
  }),
};
