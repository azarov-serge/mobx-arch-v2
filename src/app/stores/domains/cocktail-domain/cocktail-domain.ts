import { makeObservable } from 'mobx';
import {
  Domain,
  PaginationResource,
  Resource,
  ResourceStatus,
} from '../../core';

import {
  CocktailDomainType,
  CocktailDomainKey,
  CategoryCocktails,
} from './types';

import { Cocktail } from './models';
import { Helpers, PaginationHelpers } from '../types';
import { config } from './constants';

const DEFAULT_PAGE_LIMIT = 10;

export class CocktailDomain extends Domain<
  CocktailDomainType,
  CocktailDomainKey | string
> {
  constructor() {
    super(config);

    makeObservable(this);
  }

  public getCocktailData(id: string): Helpers<Cocktail> {
    const resource = (this.config.cocktail.resource as Resource).copyWith({
      params: { i: id },
    });

    const status = this.getStatus<ResourceStatus<Cocktail>>(resource.key);
    const helpers = this.createHelpers<Cocktail>('cocktail');

    return { ...status, ...helpers };
  }

  public getCocktailsData(
    category: string
  ): PaginationHelpers<CategoryCocktails> {
    if (!category) {
      return {
        ...this.getStatus('cocktails'),
        ...this.createPaginationHelpers('cocktails'),
      };
    }

    if (!this.config[category]) {
      this.config[category] = {
        ...this.config.cocktails,
        resource: this.config.cocktails.resource.copyWith({
          params: { c: category, limit: DEFAULT_PAGE_LIMIT },
        }),
      };
    }

    const resource = this.config[category].resource as PaginationResource;

    const status = this.getPaginationStatus<ResourceStatus<CategoryCocktails>>(
      resource.keys
    );

    const helpers = this.createPaginationHelpers<CategoryCocktails>(category);

    return { ...helpers, ...status };
  }
}

export const cocktailDomain = new CocktailDomain();
