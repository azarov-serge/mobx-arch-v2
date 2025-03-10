export type ResourceMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ResourceErrorData = {
  status: number;
  message: string;
};
export type ResourceParams = Record<string, unknown>;

export type ResourceInterface = {
  /** Уникальный ключ ресурса */
  id?: string;
  key: string;
  url: string;
  method: ResourceMethod;
  params: ResourceParams;
};

export type PaginationResponse<T> = {
  count: number;
  lastId: number | string;
  page: number;
  limit: number;
  data: T[];
};

export type PageResourceParams = Record<number, ResourceParams>;

export type PaginationResourceInterface = ResourceInterface &
  ResourceInterface & {
    id: number | string;
    page?: number;
    pageParams: PageResourceParams;
  };
