import qs from 'query-string';
import { axiosInstance } from '../instances';
import {
  CategoryCocktail,
  CategoryCocktailResponse,
  CategoryCocktails,
  CategoryCocktailsResponse,
} from '../queries';
import { RequestArgs } from '../core/types';
import { PaginationResource } from '../core';
import { delay } from '../../../share';

export class CocktailHelper {
  cache: Record<string, any> = {};

  fetchCocktails = async ({
    resource,
  }: RequestArgs<CategoryCocktailsResponse>): Promise<CategoryCocktails> => {
    const paginationResource = resource as PaginationResource;
    const url = paginationResource.url;
    const category = resource.getParamsValue<string>('c', '');
    const limit = paginationResource.getParamsValue<number>('limit');

    let cache = this.cache[category] as CategoryCocktails;

    if (!cache) {
      const response = await axiosInstance<{
        drinks: CategoryCocktailResponse[];
      }>({
        url: `${url}?${qs.stringify({ c: category })}`,
        method: resource.method,
      });

      this.cache[category] = {
        count: response.data.drinks.length,
        lastId: '',
        data: response.data.drinks.map(CategoryCocktail.fromJson),
        page: paginationResource.page,
        limit,
      };
    } else {
      await delay(1_000);
    }

    cache = this.cache[category] as CategoryCocktails;

    const prevLastId = paginationResource.getPaginationParamsValue<string>(
      'last-id',
      ''
    );

    const prevLastIndex = prevLastId
      ? this.findIndex(cache.data, prevLastId)
      : 0;

    const { id: lastId, index: lastIndex } = this.getLast(
      cache.data,
      prevLastId,
      limit
    );

    return {
      count: cache.data.length,
      lastId,
      data: cache.data.slice(prevLastIndex, lastIndex),
      page: paginationResource.page,
      limit,
    };
  };

  private findIndex(
    cocktails: CategoryCocktail[],
    lastId: CategoryCocktail['id']
  ): number {
    let cocktailIndex = 0;

    for (let index = 0; index < cocktails.length; index++) {
      const cocktail = cocktails[index];

      if (cocktail.id === lastId) {
        cocktailIndex = index;
        break;
      }
    }

    return cocktailIndex;
  }

  private getLast = (
    cocktails: CategoryCocktail[],
    lastId: CategoryCocktail['id'],
    limit: number
  ): { id: CategoryCocktail['id']; index: number } => {
    let lastIndex = Math.min(limit, cocktails.length - 1);
    const prevIndex = this.findIndex(cocktails, lastId);

    if (lastId) {
      lastIndex = Math.min(prevIndex + limit, cocktails.length - 1);
    }

    return {
      id: cocktails[lastIndex].id,
      index: lastIndex + 1 === cocktails.length ? cocktails.length : lastIndex,
    };
  };
}

export const cocktailHelper = new CocktailHelper();
