import {
  PaginationResource,
  PaginationResourceInterface,
  Resource,
  ResourceInterface,
  ResourceParams,
  ResourceStatus,
} from './resources';

export type Statuses<T> = {
  [key: string]: ResourceStatus<T>;
};

export type FetchArgs = {
  resource: Resource | PaginationResource;
  body?: unknown;
  headers?: Record<string, string>;
};

export type RequestArgs<T> = {
  resource: Resource | PaginationResource;
  data?: unknown;
  headers?: Record<string, string>;
  withCache?: boolean;
  params?: Record<string, string> | string;
  mock?: { data: T; delay?: number };
  fetch?: (args: FetchArgs) => Promise<T>;
  adaptResponse?: (response: unknown) => T | null;
};

export type ResourceHelpers<D> = {
  fetchData: (args?: Partial<ResourceInterface>) => Promise<ResourceStatus<D>>;
  clearError: (args?: Partial<ResourceInterface>) => void;
  reset: (args?: Partial<ResourceInterface>) => void;
  resetResource: () => void;
};

export type PaginationResourceHelpers<D> = {
  fetchData: (
    args?: Partial<PaginationResourceInterface>
  ) => Promise<ResourceStatus<D>>;
  nextPage: (params: ResourceParams) => boolean;
  clearError: (args?: Partial<PaginationResourceInterface>) => void;
  reset: (args?: Partial<PaginationResourceInterface>) => void;
  resetResource: () => void;
};
