import { makeObservable } from 'mobx';

import { CocktailKey, CocktailService, cocktailService } from '../../services';
import {
  PaginationQuery,
  PaginationQueryData,
  QueryData,
  View,
} from '../../core';
import { CategoryCocktail } from '../../../../shared/models';

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
    const helpers = this.createHelpers('cocktail');

    return {
      ...status,
      ...helpers,
      fetchData: this.service.fetchCocktail,
    };
  };

  public createCocktailsData = (): PaginationQueryData<
    CategoryCocktail,
    typeof this.service.fetchCocktails
  > => {
    const query = this.service.queries.cocktails as unknown as PaginationQuery;

    const status = this.service.getPaginationStatus<CategoryCocktail>(
      query.keys
    );

    const helpers = this.createPaginationHelpers('cocktails');

    return {
      ...status,
      ...helpers,
      fetchData: this.service.fetchCocktails,
    };
  };
}

export const cocktailView = new CocktailView();
