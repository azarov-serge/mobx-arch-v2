import { action, makeObservable } from 'mobx';

import { PaginationResource, ResourceStatus } from '../../core';
import { CategoryCocktails, categoryService } from '../../services';
import { CategoryViewData } from './types';

export class CategoryView {
  private readonly categoryService = categoryService;

  constructor() {
    makeObservable(this, {
      getCategories: action.bound,
      clearGetCategoriesError: action.bound,
      resetGetCategories: action.bound,
      getCocktails: action.bound,
      clearGetCocktailsError: action.bound,
      resetGetCocktails: action.bound,
      nextCocktailsPage: action.bound,
    });
  }

  // #region Categories
  public async getCategories(): Promise<
    ReturnType<typeof categoryService.getCategories>
  > {
    return await this.categoryService.getCategories();
  }

  public clearGetCategoriesError(): void {
    this.categoryService.rest.clearError(
      this.categoryService.resources.categories.key
    );
  }

  public resetGetCategories(): void {
    this.categoryService.rest.reset(
      this.categoryService.resources.categories.key
    );
  }
  // #endregion Categories

  // #region Cocktails
  public async getCocktails(
    category: string
  ): Promise<ReturnType<typeof categoryService.getCocktails>> {
    return await this.categoryService.getCocktails(category);
  }

  public clearGetCocktailsError(category: string): void {
    this.categoryService.rest.clearError(
      this.categoryService.resources.cocktails[category].keys
    );
  }

  public resetGetCocktails(category: string): void {
    this.categoryService.rest.reset(
      this.categoryService.resources.cocktails[category].keys
    );
  }

  public nextCocktailsPage(category: string, cursor?: string): boolean {
    return this.categoryService.resources.cocktails[category].nextPage(
      cursor ?? ''
    );
  }
  // #endregion Cocktails

  public resetAll() {
    this.categoryService.rest.resetAll();
  }

  get data(): CategoryViewData {
    const {
      rest: { getStatus },
      resources,
    } = this.categoryService;

    return {
      categories: getStatus(resources.categories.key),
      cocktails: (category: string) => {
        const resource =
          resources.cocktails[category] ?? new PaginationResource();

        const status = resource.keys.reduce<ResourceStatus<CategoryCocktails>>(
          (acc, key) => {
            const pageStatus = getStatus<CategoryCocktails>(key);

            if (pageStatus) {
              const data = [
                ...(acc.response?.data ?? []),
                ...(pageStatus.response?.data ?? []),
              ];

              acc = acc.copyWith({
                ...pageStatus,
                response: {
                  page: resource.page,
                  limit: resource.limit,
                  count: 0,
                  lastId: '',
                  ...(pageStatus.response ?? {}),
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
