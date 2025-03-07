import React from 'react';
import { cocktailView } from '../../../app/stores';

export const useGetCocktail = (id: string) => {
  const service = cocktailView.service;
  const resource = service.cocktailResource.copyWith({ params: { i: id } });

  const status = cocktailView.getStatus<
    Awaited<ReturnType<typeof service.getCocktail>>
  >(resource.key);

  const { clearError, reset } = cocktailView.createResourceHelpers(
    resource.key
  );

  const getData = React.useCallback(() => {
    cocktailView.getCocktail(id);
  }, [id]);

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
