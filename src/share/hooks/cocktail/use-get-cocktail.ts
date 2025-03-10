import { cocktailView } from '../../../app/stores';

export const useGetCocktail = (id: string) => {
  return cocktailView.createCocktailData(id);
};
