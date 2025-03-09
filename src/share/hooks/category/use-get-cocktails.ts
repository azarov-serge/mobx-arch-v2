import { categoryQuery } from '../../../app/stores';

export const useGetCocktails = (category: string) => {
  const { status, getData, nextPage, clearError, reset, resetResource } =
    categoryQuery.getCocktailsHelpers(category);

  return {
    isFetching: status.isFetching,
    isFetched: status.isFetched,
    data: status.response,
    error: status.error,
    getData,
    nextPage,
    clearError,
    reset,
    resetResource,
  };
};
