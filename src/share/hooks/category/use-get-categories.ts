import React from 'react';
import { categoryQuery } from '../../../app/stores';

export const useGetCategories = () => {
  const resource = categoryQuery.categoriesResource;

  const { isFetching, isFetched, data, error, ...rest } =
    categoryQuery.getCategoriesData(resource);

  const helpers = React.useMemo(() => {
    return rest;
  }, []);

  return { isFetching, isFetched, data, error, ...helpers };
};
