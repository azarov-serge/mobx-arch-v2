import React from 'react';
import { categoryView } from '../../../app/stores';
import { ResourceParams } from '../../../app/stores/core';

export const useGetCocktails = (category: string) => {
  const service = categoryView.service;
  const resource = service.getCocktailsResources(category);

  const status = categoryView.getPaginationStatus<
    Awaited<ReturnType<typeof service.getCocktails>>
  >(resource.keys);

  const {
    clearError,
    reset,
    resetResource: resetCocktailsResource,
  } = categoryView.createResourceHelpers(resource.keys, resource.keyShort);

  const getData = React.useCallback(() => {
    if (!category) {
      return;
    }

    categoryView.getCocktails(category);
  }, [category]);

  const nextPage = (params: ResourceParams) => {
    const result = resource.nextPage(params);
    categoryView.service.cocktailsResources[category] = resource.copyWith();

    return result;
  };

  const resetResource = React.useCallback(() => {
    if (!category) {
      return;
    }

    categoryView.service.resetCocktailsResources(category);
    resetCocktailsResource();
  }, [category]);

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
