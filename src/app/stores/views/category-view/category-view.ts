import { makeObservable } from 'mobx';

import { CategoryKey, CategoryService, categoryService } from '../../services';

import { QueryData, View } from '../../core';

type CategoriesData = Awaited<
  ReturnType<typeof categoryService.fetchCategories>
>['data'];

export class CategoryView extends View<CategoryService, CategoryKey> {
  constructor() {
    super(categoryService);
    makeObservable(this);
  }

  public createCategoriesData = (): QueryData<
    CategoriesData,
    typeof this.service.fetchCategories
  > => {
    const query = this.service.queries.categories;
    const status = this.service.getStatus<CategoriesData>(query.key);
    const helpers = this.createHelpers('categories', query);

    return { ...status, ...helpers, fetchData: this.service.fetchCategories };
  };
}

export const categoryView = new CategoryView();
