import { cocktailDomain } from '../../../app/stores';

export const useGetCocktails = (category: string) => {
  return cocktailDomain.getCocktailsData(category);
};
