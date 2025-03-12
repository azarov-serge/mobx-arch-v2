export type QueryMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type QueryErrorData = {
  status: number;
  message: string;
};
export type QueryParams = Record<string, unknown>;

export type QueryInterface = {
  /** Уникальный id для POST, PATCH, PUT, DELETE запросов */
  id?: string;
  /** Уникальный ключ запроса */
  key: string;
  /** URL - для запроса с search параметрами */
  url: string;
  /**
   * Нужен как параметр для GET / DELETE запросов (получить / удалить элемент).
   * Может использоваться как уникальный ключ
   * */
  urlParam: string;
  baseUrl: string;
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

export type PaginationQueryInterface = QueryInterface & {
  id: number | string;
  page?: number;
  limit?: QueryParams;
  pageLimit: PageQueryParams;
  pageParams: PageQueryParams;
};
