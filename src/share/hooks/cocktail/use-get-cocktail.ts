import { cocktailDomain } from '../../../app/stores';

export const useGetCocktail = (id: string) => {
  return cocktailDomain.getCocktailData(id);
};
