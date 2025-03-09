import { action, makeObservable, observable } from 'mobx';
import {
  Query,
  PaginationResource,
  Resource,
  ResourceStatus,
  ResourceParams,
} from '../../core';
import { BASE_URL } from '../../endpoints';

import {
  CategoryServiceType,
  Categories,
  CategoryResponse,
  CategoryCocktails,
} from './types';

import { cocktailHelper } from '../../helpers/cocktail-helper';
import { Helpers, PaginationHelpers } from '../types';

const DEFAULT_PAGE_LIMIT = 10;
export class CategoryQuery extends Query<CategoryServiceType> {
  constructor() {
    super();
    makeObservable(this);
  }

  categoriesResource = new Resource({
    url: `${BASE_URL}/list.php?c=list`,
  });

  @observable.deep
  cocktailsResources = {} as Record<string, PaginationResource>;

  public getCategoriesData(resource: Resource): Helpers<Categories> {
    const status = this.getStatus<ResourceStatus<Categories>>(resource.key);

    const getData = async (): Promise<ResourceStatus<Categories>> => {
      return await this.rest.request<Categories>({
        resource: resource,
        adaptResponse: (response) => {
          return (response as { drinks: CategoryResponse[] }).drinks.map(
            (item) => item.strCategory
          );
        },
      });
    };

    const helpers = this.createResourceHelpers<Categories>(
      getData,
      resource.key
    );

    return { ...status, ...helpers };
  }

  public getCocktailsData(
    category: string
  ): PaginationHelpers<CategoryCocktails, ResourceParams> {
    const resource = this.getCocktailsResources(category);
    const status = this.getPaginationStatus<ResourceStatus<CategoryCocktails>>(
      resource.keys
    );

    const getData = async (): Promise<ResourceStatus<CategoryCocktails>> => {
      if (!category) {
        return new ResourceStatus();
      }

      return await this.rest.request<CategoryCocktails>({
        resource,
        fetch: cocktailHelper.fetchCocktails,
      });
    };

    const helpers = this.createResourceHelpers<CategoryCocktails>(
      getData,
      resource.key,
      resource.keyShort
    );

    const nextPage = (params: ResourceParams) => {
      const result = resource.nextPage(params);
      this.updateCocktailsResources(category, resource.copyWith());

      return result;
    };

    return { ...helpers, ...status, nextPage };
  }

  private getCocktailsResources(category: string): PaginationResource {
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

  private updateCocktailsResources = action(
    (category: string, resource: PaginationResource) => {
      this.cocktailsResources[category] = resource;
    }
  );
}

export const categoryQuery = new CategoryQuery();
