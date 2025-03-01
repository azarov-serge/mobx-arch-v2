import { makeObservable, observable } from 'mobx';
import {
  FetchResource,
  PaginationResource,
  Resource,
  ResourceStatus,
} from '../../core';
import { BASE_URL } from '../../endpoints';

import {
  CategoryServiceType,
  Categories,
  CategoryResponse,
  CategoryCocktails,
} from './types';

import { cocktailHelper } from '../../helpers/cocktail-helper';

export class CategoryService extends FetchResource<CategoryServiceType> {
  constructor() {
    super();

    makeObservable(this);
  }

  @observable.deep
  resources = {
    categories: new Resource({
      url: `${BASE_URL}/list.php?c=list`,
    }),
    cocktails: {} as Record<string, PaginationResource>,
  };

  public getCategories(): Promise<ResourceStatus<Categories>> {
    return this.rest.request<Categories>({
      resource: this.resources.categories,
      adaptResponse: (response) => {
        return (response as { drinks: CategoryResponse[] }).drinks.map(
          (item) => item.strCategory
        );
      },
    });
  }

  public getCocktails(
    category: string
  ): Promise<ResourceStatus<CategoryCocktails>> {
    let resource = this.resources.cocktails[category];

    if (!resource) {
      this.resources.cocktails[category] = new PaginationResource({
        url: `${BASE_URL}/filter.php?c=${category}`,
      });
    }

    resource = this.resources.cocktails[category];

    return this.rest.request<CategoryCocktails>({
      resource,
      fetch: cocktailHelper.fetchCocktails,
    });
  }
}

export const categoryService = new CategoryService();
