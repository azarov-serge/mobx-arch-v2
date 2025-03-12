import { cocktailView } from '../../../app/stores';

export const useGetCocktails = () => {
  return cocktailView.createCocktailsData();
};
