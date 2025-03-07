import { makeObservable, observable, toJS } from 'mobx';
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

const DEFAULT_PAGE_LIMIT = 10;
export class CategoryService extends FetchResource<CategoryServiceType> {
  constructor() {
    super();
    makeObservable(this);
  }

  categoriesResource = new Resource({
    url: `${BASE_URL}/list.php?c=list`,
  });

  @observable.deep
  cocktailsResources = {} as Record<string, PaginationResource>;

  public getCocktailsResources(category: string) {
    const resource =
      this.cocktailsResources[category] ??
      new PaginationResource({
        url: `${BASE_URL}/filter.php`,
        params: { c: category, limit: DEFAULT_PAGE_LIMIT },
      });

    if (!this.cocktailsResources[category] && category) {
      this.cocktailsResources[category] = resource;
    }

    return resource;
  }

  public getCategories(): Promise<ResourceStatus<Categories>> {
    return this.rest.request<Categories>({
      resource: this.categoriesResource,
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
    const resource = this.getCocktailsResources(category);

    return this.rest.request<CategoryCocktails>({
      resource,
      fetch: cocktailHelper.fetchCocktails,
    });
  }
}

export const categoryService = new CategoryService();
