import { Resource } from '../../core';
import { BASE_URL } from '../../endpoints';
import { CategoryResponse } from './types';

export const config = {
  categories: {
    resource: new Resource({
      url: `${BASE_URL}/list.php?c=list`,
    }),
    adaptResponse: (response: unknown) => {
      return (response as { drinks: CategoryResponse[] }).drinks.map(
        (item) => item.strCategory
      );
    },
  },
} as const;
