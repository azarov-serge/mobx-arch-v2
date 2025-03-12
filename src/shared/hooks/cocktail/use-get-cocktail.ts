import React from 'react';
import { cocktailView } from '../../../app/stores';

export const useGetCocktail = (id: string) => {
  const { isFetching, isFetched, data, error, resetQuery, ...cbs } =
    cocktailView.createCocktailData(id);

  const helpers = React.useMemo(() => {
    return {
      fetchData: () => cbs.fetchData(id),
      clearError: () => cbs.clearError({ params: { i: id } }),
      reset: () => cbs.reset({ params: { i: id } }),
    };
  }, [id]);

  return {
    isFetching,
    isFetched,
    data,
    error,
    resetQuery,
    ...helpers,
  };
};
