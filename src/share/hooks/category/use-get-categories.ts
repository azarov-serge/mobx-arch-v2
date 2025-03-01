import { categoryView } from '../../../app/stores';

export const useGetCategories = () => {
  const data = categoryView.data.categories;

  return {
    isFetching: data.isFetching,
    isFetched: data.isFetched,
    getData: categoryView.getCategories,
    clearError: categoryView.clearGetCategoriesError,
    reset: categoryView.resetGetCategories,
    data: data.response,
    error: data.error,
  };
};
