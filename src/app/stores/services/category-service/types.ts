import { PaginationResponse } from '../../core';
import { CategoryCocktail } from './models';

export type CategoryCocktailInterface = {
  id: string;
  name: string;
  img: string | null;
};

export type CategoryResponse = { strCategory: string };

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

export type Categories = string[];

export type CategoryCocktails = PaginationResponse<CategoryCocktail>;

export type CategoryServiceType = Categories | CategoryCocktail;
