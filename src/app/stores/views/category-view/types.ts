import { categoryService } from '../../services';

export type CategoryViewData = {
  categories: Awaited<ReturnType<typeof categoryService.getCategories>>;
  cocktails: (
    category: string
  ) => Awaited<ReturnType<typeof categoryService.getCocktails>>;
};
