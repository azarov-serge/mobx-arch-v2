import { cocktailQuery } from '../../../app/stores';

export const useGetCocktail = (id: string) => {
  const resource = cocktailQuery.cocktailResource.copyWith({
    params: { i: id },
  });

  const helpers = cocktailQuery.getCocktailHelpers(resource);

  return helpers;
};
