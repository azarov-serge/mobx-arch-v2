import { cocktailQuery } from '../../../app/stores';

export const useGetCocktail = (id: string) => {
  const resource = cocktailQuery.cocktailResource.copyWith({
    params: { i: id },
  });

  const { status, getData, clearError, reset } =
    cocktailQuery.getCocktailHelpers(resource);

  return {
    isFetching: status.isFetching,
    isFetched: status.isFetched,
    data: status.response,
    error: status.error,
    getData,
    clearError,
    reset,
  };
};
