import { categoryView } from '../../../app/stores';

export const useGetCategories = () => {
  return categoryView.createCategoriesData();
};
