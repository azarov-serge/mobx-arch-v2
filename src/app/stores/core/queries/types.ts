export type QueryMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryErrorData = {
  status: number;
  message: string;
};
export type QueryParams = Record<string, unknown>;

export type QueryInterface = {
  /** Уникальный ключ ресурса */
  id?: string;
  key: string;
  url: string;
  method: QueryMethod;
  params: QueryParams;
};

export type PaginationResponse<T> = {
  count: number;
  lastId: number | string;
  page: number;
  limit: number;
  data: T[];
};

export type PageQueryParams = Record<number, QueryParams>;

export type PaginationQueryInterface = QueryInterface &
  QueryInterface & {
    id: number | string;
    page?: number;
    pageParams: PageQueryParams;
  };
