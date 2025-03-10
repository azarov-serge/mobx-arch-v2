import { ResourceStatus } from '../core';
import { PaginationResourceHelpers, ResourceHelpers } from '../core/types';

export type Helpers<T> = ResourceHelpers<T> & ResourceStatus<T>;
export type PaginationHelpers<T> = PaginationResourceHelpers<T> &
  ResourceStatus<T>;
