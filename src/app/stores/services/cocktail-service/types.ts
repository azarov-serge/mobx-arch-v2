import { Cocktail } from './models';

export type CocktailInterface = {
  id: string;
  name: string;
  img: string | null;
  category: string;
  type: string;
  instructions: string;
  ingredients: string[];
};

export type CocktailIngredientsResponse = Record<
  `strIngredient${
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | number}`,
  string | null
>;

export type CocktailResponse = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string | null;
  strCategory: string;
  strAlcoholic: string;
  strInstructions: string;
} & CocktailIngredientsResponse;

export type CocktailServiceType = Cocktail;
