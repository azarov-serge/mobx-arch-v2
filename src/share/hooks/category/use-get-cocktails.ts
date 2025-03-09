import React from 'react';
import { categoryQuery } from '../../../app/stores';

export const useGetCocktails = (category: string) => {
  const { isFetching, isFetched, data, error, ...rest } =
    categoryQuery.getCocktailsData(category);

  const helpers = React.useMemo(() => {
    return rest;
  }, [category]);

  return { isFetching, isFetched, data, error, ...helpers };
};
