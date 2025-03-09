import { ResourceStatus } from '../core';
import { ResourceHelpers } from '../core/types';

export type Helpers<T> = ResourceHelpers<T> & { status: ResourceStatus<T> };
export type PaginationHelpers<T, N> = ResourceHelpers<T> & {
  status: ResourceStatus<T>;
  nextPage: (args: N) => boolean;
};
