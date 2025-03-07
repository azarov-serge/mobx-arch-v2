import { action, makeObservable } from 'mobx';

import { CocktailService, cocktailService } from '../../services';
import { View } from '../../core/view-store';

export class CocktailView extends View<CocktailService> {
  constructor() {
    super(cocktailService);
    makeObservable(this, {
      getCocktail: action.bound,
      resetAll: action.bound,
    });
  }

  // #region Cocktail
  public async getCocktail(
    id: string
  ): Promise<ReturnType<typeof cocktailService.getCocktail>> {
    return await this.service.getCocktail(id);
  }

  public resetAll() {
    this.service.rest.resetAll();
  }
}

export const cocktailView = new CocktailView();
