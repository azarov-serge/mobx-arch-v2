import { action, makeObservable } from 'mobx';

import { cocktailService } from '../../services';
import { CocktailViewData } from './types';

export class CocktailView {
  private readonly cocktailService = cocktailService;

  constructor() {
    makeObservable(this, {
      getCocktail: action.bound,
      clearGetCocktailError: action.bound,
      resetGetCocktail: action.bound,
    });
  }

  // #region Cocktail
  public async getCocktail(
    id: string
  ): Promise<ReturnType<typeof cocktailService.getCocktail>> {
    return await this.cocktailService.getCocktail(id);
  }

  public clearGetCocktailError(id: string): void {
    this.cocktailService.rest.clearError(
      this.cocktailService.resources.cocktail(id).key
    );
  }

  public resetGetCocktail(id: string): void {
    this.cocktailService.rest.reset(
      this.cocktailService.resources.cocktail(id).key
    );
  }
  // #endregion Cocktail

  public resetAll() {
    this.cocktailService.rest.resetAll();
  }

  get data(): CocktailViewData {
    const {
      rest: { getStatus },
      resources,
    } = this.cocktailService;

    return {
      cocktail: (id: string) => getStatus(resources.cocktail(id).key),
    };
  }
}

export const cocktailView = new CocktailView();
