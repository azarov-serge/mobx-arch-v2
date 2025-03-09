import { categoryQuery } from '../../../app/stores';

export const useGetCocktails = (category: string) => {
  const helpers = categoryQuery.getCocktailsHelpers(category);

  return helpers;
};
