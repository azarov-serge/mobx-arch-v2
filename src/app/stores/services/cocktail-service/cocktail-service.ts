import { makeObservable } from 'mobx';
import { FetchResource, Resource, ResourceStatus } from '../../core';
import { BASE_URL } from '../../endpoints';

import { CocktailResponse, CocktailServiceType } from './types';

import { Cocktail } from './models';

export class CocktailService extends FetchResource<CocktailServiceType> {
  constructor() {
    super();

    makeObservable(this);
  }

  cocktailResource = new Resource({
    url: `${BASE_URL}/lookup.php`,
  });

  public getCocktail(id: string): Promise<ResourceStatus<Cocktail>> {
    const resource = this.cocktailResource.copyWith({
      params: { i: id },
    });

    return this.rest.request<Cocktail>({
      resource,
      adaptResponse: (response) => {
        const cocktailResponse = (response as { drinks: CocktailResponse[] })
          .drinks[0];

        return cocktailResponse ? Cocktail.fromJson(cocktailResponse) : null;
      },
    });
  }
}

export const cocktailService = new CocktailService();
