import { makeObservable } from 'mobx';

import { CategoryCocktail, Cocktail } from '../../../../shared/models';
import {
  FetchResource,
  PaginationQuery,
  PaginationResponse,
  Query,
  QueryStatus,
} from '../../core';
import { cocktailHelper } from '../../helpers/cocktail-helper';

import { BASE_URL } from '../../endpoints';

import { CocktailKey, CocktailResponse, CocktailServiceType } from './types';

import { queries } from './constants';

export class CocktailService extends FetchResource<
  CocktailServiceType,
  CocktailKey
> {
  constructor() {
    super(queries);

    makeObservable(this);
  }

  cocktailQuery = new Query({
    url: `${BASE_URL}/lookup.php`,
  });

  public fetchCocktail = (
    id: string
  ): Promise<QueryStatus<Cocktail | null>> => {
    const query = this.cocktailQuery.copyWith({
      params: { i: id },
    });

    return this.rest.request<Cocktail | null>({
      query,
      adaptResponse: (response) => {
        const cocktailResponse = (response as { drinks: CocktailResponse[] })
          .drinks[0];

        return cocktailResponse ? Cocktail.fromJson(cocktailResponse) : null;
      },
    });
  };

  public fetchCocktails = async (
    category: string
  ): Promise<QueryStatus<PaginationResponse<CategoryCocktail>>> => {
    const query = this.queries.cocktails.copyWith() as PaginationQuery;

    query.setParams({ c: category });

    this.setQuery('cocktails', query);

    return await this.rest.request<PaginationResponse<CategoryCocktail>>({
      query,
      fetch: cocktailHelper.fetchCocktails,
    });
  };
}

export const cocktailService = new CocktailService();
