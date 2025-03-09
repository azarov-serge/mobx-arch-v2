import { ResourceStatus } from '../core';
import { ResourceHelpers } from '../core/types';

export type Helpers<T> = ResourceHelpers<T> & ResourceStatus<T>;
export type PaginationHelpers<T, N> = ResourceHelpers<T> &
  ResourceStatus<T> & {
    nextPage: (args: N) => boolean;
  };
