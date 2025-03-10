import { makeObservable } from 'mobx';

import { Cocktail } from '../../../../shared/models';
import { FetchResource, Query, QueryStatus } from '../../core';
import { cocktailHelper } from '../../helpers/cocktail-helper';

import { BASE_URL } from '../../endpoints';

import {
  CategoryCocktails,
  CocktailKey,
  CocktailResponse,
  CocktailServiceType,
} from './types';

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
  ): Promise<QueryStatus<CategoryCocktails>> => {
    if (!category) {
      return this.getPaginationStatus<CategoryCocktails>([]);
    }

    if (!this.queries[category]) {
      this.setQuery(
        category,
        this.queries.cocktails.copyWith({
          params: { ...this.queries.cocktails.params, c: category },
        })
      );
    }

    const query = this.queries[category];

    return await this.rest.request<CategoryCocktails>({
      query,
      fetch: cocktailHelper.fetchCocktails,
    });
  };
}

export const cocktailService = new CocktailService();
