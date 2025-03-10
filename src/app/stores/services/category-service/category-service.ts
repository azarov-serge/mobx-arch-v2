import { makeObservable } from 'mobx';
import { FetchResource, QueryStatus } from '../../core';

import {
  CategoryServiceType,
  CategoryKey,
  Categories,
  CategoryResponse,
} from './types';

import { queries } from './constants';

export class CategoryService extends FetchResource<
  CategoryServiceType,
  CategoryKey
> {
  constructor() {
    super(queries);
    makeObservable(this);
  }

  public fetchCategories = (): Promise<QueryStatus<Categories | null>> => {
    return this.rest.request<Categories | null>({
      query: this.queries.categories,
      adaptResponse: (response) => {
        return (response as { drinks: CategoryResponse[] }).drinks.map(
          (item) => item.strCategory
        );
      },
    });
  };
}

export const categoryService = new CategoryService();
