import {
  CocktailInterface,
  CocktailResponse,
  CocktailIngredientsResponse,
} from '../types';

const INGREDIENTS_COUNT = 15;

export class Cocktail implements CocktailInterface {
  id: string = new Date().toISOString();
  name: string = '';
  img: string = '';
  category: string = '';
  instructions: string = '';
  ingredients: string[] = [];
  type: string = '';

  constructor(data?: CocktailInterface) {
    this.id = data?.id ?? this.id;
    this.name = data?.name ?? this.name;
    this.img = data?.img ?? this.img;
    this.category = data?.category ?? this.category;
    this.instructions = data?.instructions ?? this.instructions;
    this.ingredients = data?.ingredients ?? this.ingredients;
    this.type = data?.type ?? this.type;
  }

  public toJson = (): CocktailResponse => {
    return {
      idDrink: this.id,
      strDrink: this.name,
      strDrinkThumb: this.img,
      strCategory: this.category,
      strAlcoholic: this.type,
      strInstructions: this.instructions,
      ...new Array(INGREDIENTS_COUNT)
        .fill('strIngredient')
        .reduce<CocktailIngredientsResponse>((acc, name, index) => {
          const key = `${name}${
            index + 1
          }` as keyof CocktailIngredientsResponse;

          acc[key] = this.ingredients[index] ?? null;

          return acc;
        }, {} as CocktailIngredientsResponse),
    };
  };

  public copyWith = (data: Partial<Cocktail>): Cocktail => {
    return new Cocktail({
      ...this,
      ...data,
    });
  };

  static fromJson = (json: CocktailResponse): Cocktail => {
    const ingredients = [];
    for (let index = 0; index < INGREDIENTS_COUNT; index++) {
      const ingredient = json[`strIngredient${index + 1}`];

      if (ingredient) {
        ingredients.push(ingredient);
      }
    }
    return new Cocktail({
      id: json.idDrink,
      name: json.strDrink,
      img: json.strDrinkThumb,
      category: json.strCategory,
      type: json.strAlcoholic,
      instructions: json.strInstructions,
      ingredients,
    });
  };
}
