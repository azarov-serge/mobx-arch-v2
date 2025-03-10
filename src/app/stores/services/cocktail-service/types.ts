import { CategoryCocktail, Cocktail } from './models';
import { PaginationResponse } from '../../core';

export type CategoryCocktailInterface = {
  id: string;
  name: string;
  img: string | null;
};

export type CategoryCocktailResponse = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string | null;
};

export type CategoryCocktailsResponse = {
  count: number;
  lastId: number | string;
  data: CategoryCocktailResponse[];
};

export type CategoryCocktails = PaginationResponse<CategoryCocktail>;

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

export type CocktailKey = 'cocktail' | 'cocktails' | string;

export type CocktailServiceType = Cocktail;
