import { categoryQuery } from '../../../app/stores';

export const useGetCategories = () => {
  const resource = categoryQuery.categoriesResource;

  const helpers = categoryQuery.getCategoriesHelpers(resource);

  return helpers;
};
