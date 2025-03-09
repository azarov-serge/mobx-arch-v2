import { categoryQuery } from '../../../app/stores';

export const useGetCategories = () => {
  const resource = categoryQuery.categoriesResource;

  const { status, getData, clearError, reset } =
    categoryQuery.getCategoriesHelpers(resource);

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
