import { CategoryCocktailInterface, CategoryCocktailResponse } from './types';

export class CategoryCocktail implements CategoryCocktailInterface {
  id: string = new Date().toISOString();
  name: string = '';
  img: string | null = null;

  constructor(data?: CategoryCocktailInterface) {
    this.id = data?.id ?? this.id;
    this.name = data?.name ?? this.name;
    this.img = data?.img ?? this.img;
  }

  public toJson = (): CategoryCocktailResponse => {
    return {
      idDrink: this.id,
      strDrink: this.name,
      strDrinkThumb: this.img,
    };
  };

  public copyWith = (data: Partial<CategoryCocktail>): CategoryCocktail => {
    return new CategoryCocktail({
      ...this,
      ...data,
    });
  };

  static fromJson = (json: CategoryCocktailResponse): CategoryCocktail => {
    return new CategoryCocktail({
      id: json.idDrink,
      name: json.strDrink,
      img: json.strDrinkThumb,
    });
  };
}
