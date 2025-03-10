import { PaginationResource, Resource } from '../../core';
import { RequestArgs } from '../../core/types';
import { BASE_URL } from '../../endpoints';
import { cocktailHelper } from '../../helpers/cocktail-helper';
import { Cocktail } from './models';
import { CocktailDomainType, CocktailResponse } from './types';

export const config: Record<string, RequestArgs<CocktailDomainType>> = {
  cocktail: {
    resource: new Resource({
      url: `${BASE_URL}/lookup.php`,
    }),
    adaptResponse: (response: unknown) => {
      const cocktailResponse = (response as { drinks: CocktailResponse[] })
        .drinks[0];

      return cocktailResponse ? Cocktail.fromJson(cocktailResponse) : null;
    },
  },
  cocktails: {
    resource: new PaginationResource({
      url: `${BASE_URL}/filter.php`,
    }),
    // @ts-ignore
    fetch: cocktailHelper.fetchCocktails,
  },
} as const;
