import { PaginationResource, Resource, ResourceStatus } from './resources';

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

export type CreateResourceHelpersReturnData = {
  clearError: () => void;
  reset: () => void;
};
