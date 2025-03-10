import { cocktailView } from '../../../app/stores';

export const useGetCocktails = (category: string) => {
  return cocktailView.createCocktailsData(category);
};
