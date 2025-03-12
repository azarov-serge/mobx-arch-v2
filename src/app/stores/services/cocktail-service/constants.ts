import { PaginationQuery, Query } from '../../core';
import { BASE_URL } from '../../endpoints';
import { CocktailKey } from './types';

export const COCKTAILS_PAGE_LIMIT = 10;

export const queries: Record<CocktailKey, Query | PaginationQuery> = {
  cocktail: new Query({
    url: `${BASE_URL}/lookup.php`,
  }),
  cocktails: new PaginationQuery({
    url: `${BASE_URL}/filter.php`,
    limit: { limit: COCKTAILS_PAGE_LIMIT },
  }),
};
