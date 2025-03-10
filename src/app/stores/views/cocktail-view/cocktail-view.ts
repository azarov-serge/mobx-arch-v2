import { makeObservable } from 'mobx';

import {
  CategoryCocktails,
  CocktailKey,
  CocktailService,
  cocktailService,
} from '../../services';
import {
  PaginationQuery,
  PaginationQueryData,
  QueryData,
  View,
} from '../../core';

type CocktailData = Awaited<
  ReturnType<typeof cocktailService.fetchCocktail>
>['data'];

export class CocktailView extends View<CocktailService, CocktailKey> {
  constructor() {
    super(cocktailService);
    makeObservable(this);
  }

  public createCocktailData = (
    id: string
  ): QueryData<CocktailData, typeof this.service.fetchCocktail> => {
    const query = this.service.queries.cocktail.copyWith({
      params: { i: id },
    });

    const status = this.service.getStatus<CocktailData>(query.key);
    const helpers = this.createHelpers('categories', query);

    return {
      ...status,
      ...helpers,
      fetchData: this.service.fetchCocktail,
    };
  };

  public createCocktailsData = (
    category: string
  ): PaginationQueryData<
    CategoryCocktails,
    typeof this.service.fetchCocktails
  > => {
    const query = (this.service.queries[category] ??
      this.service.queries.cocktails.copyWith({
        params: { ...this.service.queries.cocktails.params, c: category },
      })) as PaginationQuery;

    const status = this.service.getPaginationStatus<CategoryCocktails>(
      query.keys
    );
    const helpers = this.createPaginationHelpers(category, query);

    return {
      ...status,
      ...helpers,
      fetchData: this.service.fetchCocktails,
    };
  };

  public resetAll() {
    this.service.rest.resetAll();
  }
}

export const cocktailView = new CocktailView();
