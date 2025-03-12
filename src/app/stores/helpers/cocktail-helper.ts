import qs from 'query-string';
import { axiosInstance } from '../instances';
import { RequestArgs } from '../core/types';
import { PaginationQuery, PaginationResponse, QueryError } from '../core';
import { delay } from '../../../shared';
import { CategoryCocktailResponse } from '../../../shared/models/types';
import { CategoryCocktail } from '../../../shared/models';

export class CocktailHelper {
  cache: Record<string, any> = {};

  fetchCocktails = async (
    args?: Partial<RequestArgs<PaginationResponse<CategoryCocktail>>>
  ): Promise<PaginationResponse<CategoryCocktail>> => {
    const { query } = args ?? {};
    if (!query) {
      throw new QueryError({ status: 422, message: 'Query not found' });
    }
    const paginationQuery = query as PaginationQuery;
    const category = query.getParamsValue<string>('c', '');
    const limit = paginationQuery.limit['limit'] as number;

    let cache = this.cache[category] as PaginationResponse<CategoryCocktail>;

    if (!cache) {
      const response = await axiosInstance<{
        drinks: CategoryCocktailResponse[];
      }>({
        url: `${paginationQuery.baseUrl}?${qs.stringify(
          paginationQuery.params
        )}`,
        method: query.method,
      });

      this.cache[category] = {
        count: response.data.drinks.length,
        lastId: '',
        data: response.data.drinks.map(CategoryCocktail.fromJson),
        page: paginationQuery.page,
        limit,
      };
    } else {
      await delay(1_000);
    }

    cache = this.cache[category] as PaginationResponse<CategoryCocktail>;

    const prevLastId = paginationQuery.getPaginationParamsValue<string>(
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
      page: paginationQuery.page,
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
