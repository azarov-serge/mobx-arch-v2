import { makeObservable } from 'mobx';
import { Query, Resource, ResourceStatus } from '../../core';
import { BASE_URL } from '../../endpoints';

import { CocktailResponse, CocktailServiceType } from './types';

import { Cocktail } from './models';
import { Helpers } from '../types';

export class CocktailQuery extends Query<CocktailServiceType> {
  constructor() {
    super();

    makeObservable(this);
  }

  cocktailResource = new Resource({
    url: `${BASE_URL}/lookup.php`,
  });

  public getCocktailData(id: string): Helpers<Cocktail> {
    const resource = this.cocktailResource.copyWith({ params: { i: id } });
    const status = this.getStatus<ResourceStatus<Cocktail>>(resource.key);

    const getData = async (): Promise<ResourceStatus<Cocktail>> => {
      return await this.rest.request<Cocktail>({
        resource,
        adaptResponse: (response) => {
          const cocktailResponse = (response as { drinks: CocktailResponse[] })
            .drinks[0];

          return cocktailResponse ? Cocktail.fromJson(cocktailResponse) : null;
        },
      });
    };

    const helpers = this.createResourceHelpers<Cocktail>(getData, resource.key);

    return { ...status, ...helpers };
  }
}

export const cocktailQuery = new CocktailQuery();
