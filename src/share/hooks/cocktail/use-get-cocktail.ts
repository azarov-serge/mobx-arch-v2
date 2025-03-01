import { cocktailView } from '../../../app/stores';

export const useGetCocktail = (id: string) => {
  const data = cocktailView.data.cocktail(id);

  return {
    isFetching: data.isFetching,
    isFetched: data.isFetched,
    getData: cocktailView.getCocktail,
    clearError: (id: string) => cocktailView.clearGetCocktailError(id),
    reset: (id: string) => cocktailView.resetGetCocktail(id),
    data: data.response,
    error: data.error,
  };
};
