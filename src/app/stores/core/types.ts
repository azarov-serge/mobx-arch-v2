import {
  PaginationQuery,
  PaginationQueryInterface,
  PaginationResponse,
  Query,
  QueryInterface,
  QueryParams,
  QueryStatus,
} from './queries';

export type Statuses<T> = {
  [key: string]: QueryStatus<T>;
};

export type FetchArgs = {
  query: Query | PaginationQuery;
  data?: unknown;
  headers?: Record<string, string>;
};

export type RequestArgs<T> = {
  query: Query | PaginationQuery;
  data?: unknown;
  headers?: Record<string, string>;
  withCache?: boolean;
  params?: Record<string, string> | string;
  mock?: { data: T; delay?: number };
  fetch?: (args?: Partial<FetchArgs>) => Promise<T>;
  adaptResponse?: <R>(response: R) => T | null;
};

export type QueryHelpers = {
  clearError: (args?: Partial<QueryInterface>) => void;
  reset: (args?: Partial<QueryInterface>) => void;
  resetQuery: () => void;
};

export type PaginationQueryHelpers = {
  nextPage: (params: QueryParams) => boolean;
  clearError: (args?: Partial<PaginationQueryInterface>) => void;
  reset: (args?: Partial<PaginationQueryInterface>) => void;
  resetQuery: () => void;
};

export type QueryData<T, Fn> = QueryHelpers &
  QueryStatus<T> & { fetchData: Fn };

export type PaginationQueryData<T, Fn> = PaginationQueryHelpers &
  QueryStatus<PaginationResponse<T>> & { fetchData: Fn };
