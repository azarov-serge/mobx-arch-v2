import { categoryDomain } from '../../../app/stores';

export const useGetCategories = () => {
  return categoryDomain.getCategoriesData();
};
