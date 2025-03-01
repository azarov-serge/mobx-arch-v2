import { makeObservable, observable } from 'mobx';
import {
  FetchResource,
  PaginationResource,
  Resource,
  ResourceStatus,
} from '../../core';
import { BASE_URL } from '../../endpoints';

import { CocktailResponse, CocktailServiceType } from './types';

import { Cocktail } from './models';

export class CocktailService extends FetchResource<CocktailServiceType> {
  constructor() {
    super();

    makeObservable(this);
  }

  @observable.deep
  resources = {
    cocktail: (id: string) =>
      new Resource({
        url: `${BASE_URL}/lookup.php?i=${id}`,
      }),
  };

  public getCocktail(id: string): Promise<ResourceStatus<Cocktail>> {
    return this.rest.request<Cocktail>({
      resource: this.resources.cocktail(id),
      adaptResponse: (response) => {
        const cocktailResponse = (response as { drinks: CocktailResponse[] })
          .drinks[0];

        return cocktailResponse ? Cocktail.fromJson(cocktailResponse) : null;
      },
    });
  }
}

export const cocktailService = new CocktailService();
