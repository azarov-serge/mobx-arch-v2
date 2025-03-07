import { action, makeObservable } from 'mobx';

import { CategoryService, categoryService } from '../../services';

import { View } from '../../core/view-store';

export class CategoryView extends View<CategoryService> {
  constructor() {
    super(categoryService);
    makeObservable(this, {
      getCategories: action.bound,
      getCocktails: action.bound,
      resetAll: action.bound,
    });
  }

  public async getCategories(): Promise<
    ReturnType<typeof categoryService.getCategories>
  > {
    return await this.service.getCategories();
  }

  public async getCocktails(
    category: string
  ): Promise<ReturnType<typeof categoryService.getCocktails>> {
    return await this.service.getCocktails(category);
  }

  public resetAll() {
    this.service.rest.resetAll();
  }
}

export const categoryView = new CategoryView();
