import { categoryView } from '../../../app/stores';

export const useGetCocktails = (category: string) => {
  const data = categoryView.data.cocktails(category);

  return {
    isFetching: data.isFetching,
    isFetched: data.isFetched,
    getData: categoryView.getCocktails,
    nextPage: categoryView.nextCocktailsPage,
    clearError: categoryView.clearGetCocktailsError,
    reset: categoryView.resetGetCocktails,
    data: data.response,
    error: data.error,
  };
};
