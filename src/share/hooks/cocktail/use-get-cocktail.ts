import React from 'react';
import { cocktailQuery } from '../../../app/stores';

export const useGetCocktail = (id: string) => {
  const resource = cocktailQuery.cocktailResource.copyWith({
    params: { i: id },
  });

  const { isFetching, isFetched, data, error, ...rest } =
    cocktailQuery.getCocktailData(resource);
  const helpers = React.useMemo(() => {
    return rest;
  }, []);

  return { isFetching, isFetched, data, error, ...helpers };
};
