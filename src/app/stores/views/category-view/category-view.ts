import { action, makeObservable } from 'mobx';

import {
  CategoryCocktails,
  CategoryService,
  categoryService,
} from '../../services';

import { View } from '../../core/view-store';
import { delay } from '../../../../share';
import { ResourceStatus } from '../../core';
import { CategoryViewData } from './types';

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
    await delay(1_000);
    return await this.service.getCocktails(category);
  }

  public resetAll() {
    this.service.rest.resetAll();
  }

  get data(): CategoryViewData {
    return {
      categories: this.service.rest.getStatus(
        this.service.categoriesResource.key
      ),
      cocktails: (category: string) => {
        const resource = this.service.getCocktailsResources(category);

        const status = resource.keys.reduce<ResourceStatus<CategoryCocktails>>(
          (acc, key) => {
            const pageStatus =
              this.service.rest.getStatus<CategoryCocktails>(key);

            if (pageStatus.response) {
              const data = [
                ...(acc.response?.data ?? []),
                ...(pageStatus.response?.data ?? []),
              ];

              acc = acc.copyWith({
                ...pageStatus,
                response: {
                  ...pageStatus.response,
                  data,
                },
              });
            }

            return acc;
          },
          new ResourceStatus<CategoryCocktails>()
        );

        return status;
      },
    };
  }
}

export const categoryView = new CategoryView();
