import { cocktailService } from '../../services';

export type CocktailViewData = {
  cocktail: (
    id: string
  ) => Awaited<ReturnType<typeof cocktailService.getCocktail>>;
};
