import { categoryView } from '../../../app/stores';

export const useGetCategories = () => {
  const service = categoryView.service;
  const resource = service.categoriesResource;

  const status = categoryView.getStatus<
    Awaited<ReturnType<typeof service.getCategories>>
  >(resource.key);

  const { clearError, reset } = categoryView.createResourceHelpers(
    resource.key
  );

  return {
    isFetching: status.isFetching,
    isFetched: status.isFetched,
    data: status.response,
    error: status.error,
    getData: categoryView.getCategories,
    clearError,
    reset,
  };
};
